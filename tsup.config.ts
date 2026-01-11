import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  shims: true,
  minify: false,
  target: 'node18',
  splitting: false,
  sourcemap: true,
  banner: {
    js: '#!/usr/bin/env node'
  }
});
