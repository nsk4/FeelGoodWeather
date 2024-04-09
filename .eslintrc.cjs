/** @type { import("eslint").Linter.Config } */
module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:svelte/recommended',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte']
    },
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    overrides: [
        {
            files: ['*.svelte'],
            parser: 'svelte-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser'
            }
        }
    ],
    rules: {
        semi: 'off',
        '@typescript-eslint/semi': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
                allowHigherOrderFunctions: true
            }
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-explicit-any': 'error'
    }
};
