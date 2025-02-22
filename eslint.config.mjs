// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.stylistic,
    { ignores: ['**/.next/', 'dist/*', 'app/*', 'node_modules/*', '**/next.config.js', '**/next-env.d.ts', '**/preload.d.ts']}
);