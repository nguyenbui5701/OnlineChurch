import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { repositoryRoot, validateBuildDirectory } from './build-path.mjs';

try {
  const directory = await validateBuildDirectory(process.env.APP_BUILD_DIRECTORY);
  const require = createRequire(import.meta.url);
  const zodLicense = await readFile(resolve(dirname(require.resolve('zod/package.json')), 'LICENSE'), 'utf8');
  const result = await build({
    absWorkingDir: repositoryRoot,
    entryPoints: ['apps/server/src/index.ts'],
    outfile: resolve(directory, 'server.mjs'),
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22.12',
    write: false,
    legalComments: 'inline',
    banner: { js: `/*! Bundled Zod license:\n${zodLicense}\n*/` },
  });
  await validateBuildDirectory(directory);
  await mkdir(directory, { recursive: true });
  await validateBuildDirectory(directory);
  const output = result.outputFiles[0];
  if (!output || result.outputFiles.length !== 1) throw new Error('Expected one server bundle.');
  // No recursive cleanup: generated output is the only file replaced.
  await writeFile(resolve(directory, 'server.mjs'), output.contents);
  console.log(`OnlineChurch build: ${resolve(directory, 'server.mjs')}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Build failed.');
  process.exitCode = 1;
}
