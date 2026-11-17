import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

/** Collect actual installed license notices for packages seen by the bundler.
 * @param {string} root @param {import('esbuild').Metafile} metadata
 */
export async function bundleLicenses(root, metadata) {
  const directories = new Set(Object.keys(metadata.inputs).flatMap(input => {
    const match = input.replaceAll('\\', '/').match(/^(.*node_modules\/(?:@[^/]+\/)?[^/]+)\//);
    return match?.[1] ? [match[1]] : [];
  }));
  const sections = [];
  for (const directory of [...directories].sort()) {
    const location = resolve(root, directory);
    const pkg = JSON.parse(await readFile(resolve(location, 'package.json'), 'utf8'));
    const names = (await readdir(location)).filter(name => /^(licen[sc]e|copying|copyright|notice)(\..*)?$/i.test(name));
    if (names.length === 0) throw new Error(`Missing installed license notice for ${pkg.name}; build stopped.`);
    const notices = await Promise.all(names.map(name => readFile(resolve(location, name), 'utf8')));
    sections.push(`${pkg.name}@${pkg.version} — ${pkg.license ?? 'SEE NOTICE'}\n${notices.join('\n')}`);
  }
  return sections.join('\n\n----------------------------------------\n\n');
}
