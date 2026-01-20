import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig([
  // Main SDK library
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
  },
  // CLI tool
  {
    entry: ['cli/index.ts'],
    format: ['cjs'],
    dts: false,
    sourcemap: true,
    outDir: 'dist/cli',
    define: {
      'process.env.PKG_VERSION': JSON.stringify(pkg.version),
    },
  },
]);
