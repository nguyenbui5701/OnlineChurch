import { realpath } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertGeneratedPath, GENERATED_FILES, validateArtifact, within } from './artifact-paths.mjs';

export const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));

/** Validate without creating, deleting, or opening any output for writing.
 * Overrides are restricted further to dist/** to protect tracked source files.
 * @param {unknown} requested
 * @returns {Promise<string>}
 */
export async function validateBuildDirectory(requested = 'dist') {
  if (typeof requested !== 'string' || requested.trim() === '' || requested.includes('\0')) {
    throw new Error('APP_BUILD_DIRECTORY must be a path under OnlineChurch/dist.');
  }
  const root = await realpath(repositoryRoot);
  const output = resolve(root, requested);
  if (!within(resolve(root, 'dist'), output)) {
    throw new Error('APP_BUILD_DIRECTORY must stay inside OnlineChurch/dist; no files were written.');
  }
  await assertGeneratedPath(root, output, 'directory');
  // Validate every overlay file before any output is written, not just server.mjs.
  for (const name of GENERATED_FILES) await validateArtifact(root, output, name);
  return output;
}
