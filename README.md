# Flippo UI

The Flippo UI component system in one pnpm workspace: the behaviour of the components (state machines and their React
and custom element adapters), the shared styles of the design system and the two UI kits built on them. Each package
is versioned and published on its own.

| Package | What it is |
| --- | --- |
| [`packages/store`](packages/store) · `@flippo-software/store` | Reactive stores, no DOM, no framework. |
| [`packages/core-components`](packages/core-components) · `@flippo-software/core-components` | Framework-agnostic state machines of every component. |
| [`packages/react-hooks`](packages/react-hooks) · `@flippo-software/react-hooks` | Generic React hooks; the store in React. |
| [`packages/react-components`](packages/react-components) · `@flippo-software/react-components` | Unstyled React components (Base UI API) on the machines. |
| [`packages/web-components`](packages/web-components) · `@flippo-software/web-components` | Unstyled custom elements on the same machines. |
| [`packages/component-styles`](packages/component-styles) · `@flippo-software/component-styles` | Tokens, themes, component CSS (SCSS) and class recipes. |
| [`packages/ui-kit-react`](packages/ui-kit-react) · `@flippo-software/ui-kit-react` | The Flippo look on react-components. |
| [`packages/ui-kit-web`](packages/ui-kit-web) · `@flippo-software/ui-kit-web` | The Flippo look on web-components. |
| [`packages/internal-test-utils`](packages/internal-test-utils) · `@flippo-software/internal-test-utils` | Test helpers of react-components. |

The git history of the former repositories (`core-components`, `headless-components`, `hooks`,
`internal-test-utils`, `flippo-components`) is kept: it was imported with `git subtree`.

## Commands

Run from the root:

```sh
pnpm install            # installs every package, links the workspace packages to each other
pnpm build              # builds every package, dependencies first (store → core → adapters → kits)
pnpm dev                # watch builds of store, core, hooks, react-components and web-components
pnpm check              # build, lint, typecheck and test everything
pnpm storybook:react    # Storybook of the React kit (port 6006)
pnpm storybook:web      # Storybook of the web components kit (port 6007)
```

One package: `pnpm --filter <name> <script>`, e.g. `pnpm --filter @flippo-software/ui-kit-react test`, or run the
script inside its folder. Add a dependency to one package: `pnpm --filter <name> add <dependency>`.

## Working across packages

The behaviour packages are consumed from their `dist`: keep `pnpm dev` running while changing them, and the kits'
Storybook and tests see the new builds.

The kits read `component-styles` from its sources during development: Storybook, Vitest and TypeScript resolve the
`source` export condition (`devExports: 'source'` in `component-styles/tsdown.config.ts`, wiring in
[`tools/workspace.ts`](tools/workspace.ts)). Run a kit's Storybook and edit `packages/component-styles/src/**`: the
open story updates without building `component-styles`. Builds, lint and published packages use `dist`.

## Continuous integration

`.github/workflows/check.yaml` builds the workspace once, then runs lint, typecheck and tests in parallel against that
build (the packages use each other's `dist`). It runs on pull requests, and the release workflow calls it first:
nothing is released or published unless it passes. `.github/actions/setup` installs pnpm, Node and the dependencies
for every job.

## Versions and releases

Each package has its own version and is released on its own, by [release-please](https://github.com/googleapis/release-please)
from [conventional commits](https://www.conventionalcommits.org) (`.github/workflows/release.yaml`):

1. Commit with a conventional message: `fix(core-components): …` → patch, `feat(core-components): …` → minor, `feat(core-components)!: …` or a
   `BREAKING CHANGE:` footer → major (a minor while the version is `0.x`). The package is the folder the commit
   changes, not the scope: a commit that changes `packages/core-components` and `packages/react-components` releases both.
   `chore`, `docs`, `test`, `refactor`… do not release anything. Pull requests check the messages (commitlint).
2. On each push to `main`, release-please updates one release pull request: the next version and the CHANGELOG of
   every package with releasable commits since its last release. Nothing else is bumped.
3. Merging that pull request tags the released packages (`core-components-v0.2.0`), creates their GitHub releases
   and publishes exactly these packages to npm.

Versions live in `.release-please-manifest.json`, the packages in `release-please-config.json`. Private packages
(`internal-test-utils`, `workspace-tools`) are not in it and are never released.

Dependencies between packages: `workspace:^` (published as `^<version>`, so a new version of a dependency reaches the
dependents' users without re-releasing them, as long as it stays in range), `workspace:*` for dev dependencies. Shared tool versions are in the
`catalog` of `pnpm-workspace.yaml` (`"typescript": "catalog:"`); a package that needs another version writes it
explicitly (`hooks` keeps `"typescript": "^5.9.2"`).
