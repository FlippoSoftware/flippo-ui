# Flippo UI kits

A pnpm workspace with the shared styles of the Flippo design system and the two UI kits built on them. Each package
is versioned and published on its own:

| Package | What it is |
| --- | --- |
| [`packages/component-styles`](packages/component-styles) · `@flippo-software/component-styles` | Tokens, themes, component CSS (SCSS) and class recipes. |
| [`packages/ui-kit-react`](packages/ui-kit-react) · `@flippo-software/ui-kit-react` | React components (headless parts + the recipes). |
| [`packages/ui-kit-web`](packages/ui-kit-web) · `@flippo-software/ui-kit-web` | Custom elements (web components + the recipes). |

The behaviour packages (`core`, `headless-components`, `web-components`, `store`) live in their own repositories next
to this one; the kits link them with `link:../../../<repo>` (build them first).

## Commands

Run from the root:

```sh
pnpm install            # installs every package, links the workspace packages to each other
pnpm build              # builds every package, dependencies first (component-styles, then the kits)
pnpm check              # build, lint, typecheck and test everything
pnpm storybook:react    # Storybook of the React kit (port 6006)
pnpm storybook:web      # Storybook of the web components kit (port 6007)
```

One package: `pnpm --filter <name> <script>`, e.g. `pnpm --filter @flippo-software/ui-kit-react test`, or run the
script inside its folder. Add a dependency to one package: `pnpm --filter <name> add <dependency>`.

## Working on styles and kits together

The kits read `component-styles` from its sources during development: Storybook, Vitest and TypeScript resolve the
`source` export condition (`devExports: 'source'` in `component-styles/tsdown.config.ts`, wiring in
[`tools/workspace.ts`](tools/workspace.ts)). Run a kit's Storybook and edit `packages/component-styles/src/**`: the
open story updates without building `component-styles`. Builds, lint and published packages use `dist`.

## Versions

- Workspace packages depend on each other with `workspace:*` / `workspace:^`; `pnpm publish` replaces them with the
  real versions (`^0.1.0`).
- Shared tools have one version in the `catalog` of `pnpm-workspace.yaml`; packages use `"typescript": "catalog:"`.
