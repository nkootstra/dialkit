import { defineConfig } from 'tsup';

export default defineConfig([
  // Core — framework-agnostic (no React, no Motion)
  {
    entry: { 'core/index': 'src/core/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'motion'],
    onSuccess: 'cp src/styles/theme.css dist/styles.css',
  },
  // React adapter
  {
    entry: {
      'index': 'src/index.ts',
      'react/index': 'src/react/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    external: ['react', 'react-dom', 'motion'],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      };
    },
  },
  // Vanilla adapter — no framework dependencies
  {
    entry: { 'vanilla/index': 'src/vanilla/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    external: ['react', 'react-dom', 'motion'],
  },
]);
