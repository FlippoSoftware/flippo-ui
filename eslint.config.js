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
                'ts/no-unsafe-function-type': 'off'
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
            'node/prefer-global/process': ['error', 'always'],
            // Covered by Biome (`@flippo/biome`, see this package's `biome.json`):
            // `noUnusedVariables`/`noUnusedImports` already respect a `_`-prefix ignore
            // pattern by default, and `organizeImports` handles import sorting. Both must be
            // explicitly turned off (not just omitted) since `general`/antfu enable defaults.
            'unused-imports/no-unused-vars': 'off',
            'perfectionist/sort-imports': 'off'
        }
    }
);
