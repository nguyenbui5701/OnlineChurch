import { lstat, realpath } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));

/** @param {string} parent @param {string} child */
function isWithin(parent, child) {
  const part = relative(parent, child);
  return part === '' || (!isAbsolute(part) && part !== '..' && !part.startsWith(`..${sep}`));
}

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
  if (!isWithin(resolve(root, 'dist'), output)) {
    throw new Error('APP_BUILD_DIRECTORY must stay inside OnlineChurch/dist; no files were written.');
  }
  // Windows alternate data streams / ambiguous trailing-dot paths are not outputs.
  const segments = relative(root, output).split(sep);
  if (segments.some(segment => /[:<>"|?*]/.test(segment) || /[. ]$/.test(segment))) {
    throw new Error('Unsafe build path component.');
  }
  let current = root;
  for (const segment of segments) {
    current = resolve(current, segment);
    try {
      const info = await lstat(current);
      if (info.isSymbolicLink() || !info.isDirectory() || !isWithin(root, await realpath(current))) {
        throw new Error('Build path must not contain symlinks, junctions, or non-directories.');
      }
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code !== 'ENOENT') throw error;
    }
  }
  const file = resolve(output, 'server.mjs');
  try {
    const info = await lstat(file);
    if (!info.isFile() || info.isSymbolicLink() || info.nlink !== 1) {
      throw new Error('Build output must be a regular, unlinked file.');
    }
    if (!isWithin(root, await realpath(dirname(file)))) throw new Error('Build output escaped repository.');
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code !== 'ENOENT') throw error;
  }
  return output;
}
