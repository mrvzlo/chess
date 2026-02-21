import { build } from 'esbuild';
import { copyFileSync } from 'fs';

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: false,
  outfile: 'dist/main.js',
  platform: 'browser',
  target: 'ES2020',
  format: 'iife',
});

copyFileSync('src/index.html', 'dist/index.html');
