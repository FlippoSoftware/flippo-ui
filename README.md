# Flippo UI

The Flippo UI component system in one pnpm workspace: the behaviour of the components (state machines and their React
and custom element adapters), the shared styles of the design system and the two UI kits built on them. Each package
is versioned and published on its own.

| Package | What it is |
| --- | --- |
| [`packages/store`](packages/store) · `@flippo-software/store` | Reactive stores, no DOM, no framework. |
| [`packages/core`](packages/core) · `@flippo-software/core-components` | Framework-agnostic state machines of every component. |
| [`packages/hooks`](packages/hooks) · `@flippo-software/hooks` | Generic React hooks; the store in React. |
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

## Versions

- Workspace packages depend on each other with `workspace:*` / `workspace:^`; `pnpm publish` replaces them with the
  real versions (`^0.1.0`).
- Shared tools have one version in the `catalog` of `pnpm-workspace.yaml`; packages use `"typescript": "catalog:"`.
