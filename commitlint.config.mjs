/**
 * Conventional commits; the scope, when there is one, is a package folder (`fix(core-components): …`). The package of a commit
 * for release-please is the folder it changes, the scope only helps readers.
 */
export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-enum': [
            1,
            'always',
            [
                'store',
                'core-components',
                'react-store',
                'react-components',
                'web-components',
                'component-styles',
                'ui-kit-react',
                'ui-kit-web',
                'internal-test-utils',
                'workspace'
            ]
        ]
    }
};
