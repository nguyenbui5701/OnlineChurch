import { afterEach, describe, expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { lstat, mkdir, mkdtemp, readFile, readdir, rmdir, symlink, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { repositoryRoot, validateBuildDirectory } from '../scripts/build-path.mjs';

// Only generated paths created by this suite are cleaned; no recursive delete.
const files: string[] = [];
const directories: string[] = [];
afterEach(async () => {
  for (const file of files.splice(0).reverse()) await unlink(file);
  for (const directory of directories.splice(0).reverse()) await rmdir(directory);
});
async function scratch() {
  await mkdir(resolve(repositoryRoot, 'dist'), { recursive: true });
  const directory = await mkdtemp(resolve(repositoryRoot, 'dist', 'isolation-test-'));
  directories.push(directory);
  return directory;
}

describe('build path and file isolation', () => {
  it('defaults to repository dist independently of caller working directory', async () => {
    expect(await validateBuildDirectory()).toBe(resolve(repositoryRoot, 'dist'));
    expect(await validateBuildDirectory('dist/uat')).toBe(resolve(repositoryRoot, 'dist/uat'));
  });
  it.each(['', null, 42, '..', '../OnlinePagoda', 'dist/../../OnlinePagoda', '.', 'apps', 'Design', 'dist/file:stream', 'dist/path.'])('rejects unsafe output %j before writing', async value => {
    await expect(validateBuildDirectory(value)).rejects.toThrow();
  });
  it('fails an actual build for external absolute/traversal paths before changing output', async () => {
    const directory = await scratch();
    const before = await readdir(directory);
    for (const output of ['../OnlinePagoda', resolve(repositoryRoot, '..', 'OnlinePagoda'), 'dist/../../OnlinePagoda']) {
      const result = spawnSync(process.execPath, ['scripts/build.mjs'], {
        cwd: repositoryRoot, encoding: 'utf8', env: { ...process.env, APP_BUILD_DIRECTORY: output }, windowsHide: true,
      });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('must stay inside OnlineChurch/dist');
    }
    expect(await readdir(directory)).toEqual(before);
  });
  it('rejects directory symlinks/junctions even when the lexical output is inside dist', async () => {
    const directory = await scratch();
    const link = join(directory, 'escape');
    await symlink(dirname(resolve(repositoryRoot)), link, process.platform === 'win32' ? 'junction' : 'dir');
    files.push(link);
    await expect(validateBuildDirectory(join(link, 'unwritten-build'))).rejects.toThrow('symlinks');
    const result = spawnSync(process.execPath, ['scripts/build.mjs'], {
      cwd: repositoryRoot, encoding: 'utf8', env: { ...process.env, APP_BUILD_DIRECTORY: join(link, 'unwritten-build') }, windowsHide: true,
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('symlinks');
    expect((await lstat(link)).isSymbolicLink()).toBe(true);
  });
  it('rejects a directory at the output file instead of deleting it', async () => {
    const directory = await scratch();
    const output = join(directory, 'server.mjs');
    await mkdir(output);
    directories.push(output);
    await expect(validateBuildDirectory(directory)).rejects.toThrow('regular');
    expect((await lstat(output)).isDirectory()).toBe(true);
  });
  it('builds to an approved generated subdirectory without deleting unrelated files', async () => {
    const directory = await scratch();
    const sentinel = join(directory, 'keep.txt');
    await writeFile(sentinel, 'owned test sentinel');
    files.push(sentinel);
    execFileSync(process.execPath, [resolve(repositoryRoot, 'scripts/build.mjs')], {
      cwd: directory, env: { ...process.env, APP_BUILD_DIRECTORY: directory }, windowsHide: true,
    });
    files.push(join(directory, 'server.mjs'));
    expect(await readFile(sentinel, 'utf8')).toBe('owned test sentinel');
    expect(await readFile(join(directory, 'server.mjs'), 'utf8')).toContain('Copyright (c) 2025 Colin McDonnell');
  });
});
