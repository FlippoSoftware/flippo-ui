import {
    createEslintConfig,
    general,
    overridesStylisticConfig,
    overridesTsConfig
} from '@flippo/eslint';

export default createEslintConfig(
    {
        pnpm: true,
        react: true,
        typescript: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            },
            overrides: {
                ...overridesTsConfig,
                'ts/no-namespace': 'off',
                'ts/prefer-literal-enum-member': 'off',
                'ts/no-unsafe-function-type': 'off',
                'ts/naming-convention': ['warn', {
                    selector: 'variable',
                    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow'
                }],
                'ts/no-empty-object-type': 'off'
            }
        },
        stylistic: {
            jsx: true,
            semi: true,
            overrides: overridesStylisticConfig
        },
        jsx: true,
        formatters: true,
        ...general,
        ignores: ['**/*.md/*.ts']
    },
    {
        rules: {
            'react-dom/no-flush-sync': 'off',
            'react/no-context-provider': 'off',
            'no-unreachable-loop': 'off',
            'unused-imports/no-unused-vars': ['warn', {
                varsIgnorePattern: '^_',
                argsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_'
            }],
            'node/prefer-global/process': ['error', 'always'],
            'perfectionist/sort-imports': ['error', {
                type: 'natural',
                order: 'asc',
                newlinesBetween: 'always',
                internalPattern: ['^~/.+', '^@/.+', '^~@.+'],
                groups: [
                    'react',
                    'builtin',
                    'builtin-type',
                    'external',
                    'external-type',
                    'internal',
                    'internal-type',
                    'parent',
                    'parent-type',
                    'sibling',
                    'sibling-type',
                    'unknown',
                    'index',
                    'index-type',
                    'object',
                    'type'
                ],
                tsconfigRootDir: './tsconfig.json',
                customGroups: [{
                    groupName: 'react',
                    elementNamePattern: ['^react$', '^react-.+']
                }]
            }]
        }
    }
);
