import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { repositoryRoot, validateBuildDirectory } from './build-path.mjs';
import { validateArtifact } from './artifact-paths.mjs';
import { bundleLicenses } from './bundle-licenses.mjs';

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
    define: { __ONLINECHURCH_ROOT__: JSON.stringify(repositoryRoot), __ONLINECHURCH_OUTPUT__: JSON.stringify(directory) },
  });
  const browser = await build({
    absWorkingDir: repositoryRoot, entryPoints: ['apps/overlay/src/main.ts'],
    outfile: resolve(directory, 'overlay/app.js'), bundle: true, platform: 'browser',
    format: 'esm', target: 'es2022', write: false, metafile: true, minify: true,
    legalComments: 'inline', banner: { js: '/*! Third-party notices: /overlay/THIRD_PARTY_LICENSES.txt */' },
  });
  const output = result.outputFiles[0];
  if (!output || result.outputFiles.length !== 1 || browser.outputFiles.length !== 2) throw new Error('Unexpected bundle outputs.');
  const artifacts = new Map([
    ['server.mjs', output.contents],
    ['overlay/index.html', await readFile(resolve(repositoryRoot, 'apps/overlay/index.html'))],
    ['overlay/THIRD_PARTY_LICENSES.txt', Buffer.from(await bundleLicenses(repositoryRoot, browser.metafile))],
  ]);
  for (const file of browser.outputFiles) {
    const name = file.path.endsWith('app.css') ? 'overlay/app.css' : file.path.endsWith('app.js') ? 'overlay/app.js' : '';
    if (!name) throw new Error('Unexpected browser artifact.');
    artifacts.set(name, file.contents);
  }
  // Validate the complete set before the first write, then revalidate each file.
  await validateBuildDirectory(directory);
  for (const [name, contents] of artifacts) {
    const destination = await validateArtifact(repositoryRoot, directory, name);
    await mkdir(dirname(destination), { recursive: true });
    await validateArtifact(repositoryRoot, directory, name);
    await writeFile(destination, contents);
    console.log(`OnlineChurch build: ${destination} (${contents.byteLength} bytes)`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Build failed.');
  process.exitCode = 1;
}
