import { lstat, realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';

export const GENERATED_FILES = Object.freeze(['server.mjs', 'overlay/index.html', 'overlay/app.js', 'overlay/app.css', 'overlay/THIRD_PARTY_LICENSES.txt']);

/** @param {string} parent @param {string} child */
export function within(parent, child) {
  const part = relative(parent, child);
  return part === '' || (!isAbsolute(part) && part !== '..' && !part.startsWith(`..${sep}`));
}

/** Validate every ancestor and the final node. No filesystem mutation.
 * Junctions, symlinks, hardlinks and Windows ambiguous components fail closed.
 * @param {string} root @param {string} target @param {'file'|'directory'} kind
 * @param {boolean} [allowMissing]
 */
export async function assertGeneratedPath(root, target, kind, allowMissing = true) {
  const canonicalRoot = await realpath(root);
  const absolute = resolve(target);
  if (!within(resolve(canonicalRoot, 'dist'), absolute)) throw new Error('Output must stay inside OnlineChurch/dist; no files were written.');
  const segments = relative(canonicalRoot, absolute).split(sep);
  if (segments.some(part => /[:<>"|?*\x00-\x1f]/.test(part) || /[. ]$/.test(part)
    || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(part))) throw new Error('Unsafe generated path component.');
  let current = canonicalRoot;
  for (const [index, part] of segments.entries()) {
    current = resolve(current, part);
    try {
      const info = await lstat(current);
      const finalFile = index === segments.length - 1 && kind === 'file';
      if (info.isSymbolicLink()) throw new Error('Generated path must not contain symlinks or junctions.');
      if (finalFile ? !info.isFile() || info.nlink !== 1 : !info.isDirectory()) {
        throw new Error('Generated output must be a regular, unlinked file with directory parents.');
      }
      if (!within(canonicalRoot, await realpath(current))) throw new Error('Generated path escaped repository.');
    } catch (error) {
      if (!allowMissing || /** @type {NodeJS.ErrnoException} */ (error).code !== 'ENOENT') throw error;
    }
  }
  return absolute;
}

/** @param {string} root @param {string} directory @param {string} name @param {boolean} [allowMissing] */
export async function validateArtifact(root, directory, name, allowMissing = true) {
  if (!GENERATED_FILES.includes(name)) throw new Error('Artifact is not allowlisted.');
  return assertGeneratedPath(root, resolve(directory, name), 'file', allowMissing);
}
