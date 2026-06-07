import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const vendorFiles = [
  {
    from: 'node_modules/js-yaml/dist/js-yaml.mjs',
    to: 'public/admin/vendor/js-yaml.mjs',
  },
];

for (const file of vendorFiles) {
  const destination = resolve(file.to);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(file.from), destination);
}
