module.exports = {
    root: true,
    env: { browser: true, es2020: true, node: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'eslint-plugin-import'],
    settings: {
        'import/resolver': {
            typescript: {
                project: ['apps/**/tsconfig.json', 'packages/**/tsconfig.json'],
            },
            node: {
                extensions: ['js', '.ts', '.d.ts', '.tsx', '.mjs', '.cjs'],
            },
        },
    },
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'import/order': [
            'error',
            {
                groups: [
                    'type',
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                    'object',
                    'unknown',
                ],
                pathGroups: [
                    {
                        pattern: '@/**',
                        group: 'external',
                        position: 'after',
                    },
                ],
                pathGroupsExcludedImportTypes: ['type'],
                alphabetize: { order: 'asc', caseInsensitive: true },
            },
        ],
        'import/no-unresolved': ['error', { ignore: ['^virtual:', 'react-dom/client'] }],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
    },
}
