# Flippo UI — notes for agents

pnpm workspace of the whole component system: `packages/store`, `react-store`, `core-components`, `react-components`,
`web-components`, `component-styles`, `ui-kit-react`, `ui-kit-web`, `internal-test-utils` (see README). Packages with
their own `AGENTS.md` (core-components, react-components, web-components, component-styles…): read it before working there.

- Run commands from the root: `pnpm check` (build → lint → typecheck → test), `pnpm --filter <package> <script>`.
- The kits read component-styles from its sources (`source` export condition, `tools/workspace.ts`): no rebuild is
  needed for their Storybook, tests and typecheck. Lint (Biome resolution) and builds need `pnpm build` first.
- Dependencies between workspace packages: `workspace:^` (dependencies, peers), `workspace:*` (dev). Shared tool versions: the
  `catalog` in `pnpm-workspace.yaml` (`"catalog:"` in package.json).
- The behaviour packages (store, react-store, core-components, react-components, web-components) are consumed from `dist`: rebuild
  them after a change (`pnpm build`, or keep `pnpm dev` running). Their internal imports use tsconfig `paths`
  aliases (`~@lib/*`), so their sources cannot be read by other packages.
- internal-test-utils builds its types with TypeScript 5 (tsup); the rest use TypeScript 7.
- `@flippo-software/react-hooks` (generic hooks) is its own repository (`../react-hooks`), a dependency of react-components
  installed from npm like any other package.
- Releases: release-please from conventional commits (`fix(core-components): …`, `feat(ui-kit-react): …`); the package is the
  folder a commit changes. Pull requests are squash-merged: their title is the
  conventional message (checked in CI). Never edit versions or CHANGELOGs by hand.
- Imports inside a package: tsconfig `paths` aliases with the `~@` prefix (`~@lib/*`, `~@components/*`; in the kits also
  `~@src`, `~@stories`), never `../..`. Vite/Vitest get the same aliases from the package's `aliases.ts`.
- UI kits: stories in `src/components/<name>/__stories__/`, tests in `__tests__/` next to the code.
- One release pull request per package: release a dependency before its dependents (`tools/release-order.ts` stops
  the publication otherwise). Pull requests check the changed packages and their dependents (`tools/affected.ts`).
- Prereleases (`release-as` + `prerelease-type` in `release-please-config.json`) and fixes of an old major (branches
  `maintenance/<component>-v<major>`, created by the Maintenance branch workflow, cherry-picked from `main`): see README «Versions and releases». The npm
  dist-tag comes from `tools/dist-tag.ts`; never publish a prerelease or an old major under `latest`.
- Packages are published by the Release workflow only (`prepublishOnly` runs `tools/publish-guard.ts`); never
  publish by hand, never `npm publish` (it would ship `workspace:`/`catalog:` versions).
- Storybook: shared theme, docs page and API generator in `tools/storybook/` and `tools/api-docs.ts` (README «Storybook
  and the API reference»). The API reference comes from the sources, never from the docs page: props in the JSDoc of
  `react-components`, attributes in the JSDoc of `withAttributes` in `web-components` (both with `@default`), data
  attributes and CSS variables in the `<Name><Part>DataAttributes` / `<Name><Part>CssVars` enums of `core-components`
  (the machines set them; both adapters import them from there).
- Storybook texts: by key in `tools/storybook/i18n/en.json` and `ru.json` (same keys), `t('<family>.<role>.<slug>')`
  in stories at render time; after a JSDoc change of react-components run `node tools/i18n-check.ts --write` and
  translate the listed keys in `ru.json`, then `node tools/i18n-check.ts --review <key|prefix>…`. `ru.sources.json`
  records the English hashes: `--write` never updates them. `pnpm lint:check` fails on missing text, missing hashes
  or unknown keys; stale translations warn until reviewed. Never acknowledge translations without checking them.
- Documentation site content: `docs/` (README there). Hand-written pages are markdown, one file per language
  (`page.mdx`, `page.ru.mdx`), never dictionary keys; reference pages are generated (`pnpm docs:build` after `pnpm build`) from
  JSDoc/TSDoc, the Custom Elements Manifest of web-components, SassDoc (`///`) of component-styles and the READMEs.
- Translated prose has `l10n.source` in frontmatter; after reviewing it use
  `node docs/scripts/check.ts --review <translated-file>…`. Generated API pages use dictionary tracking instead.
  `docs/registry.json` links guides to public contracts; after checking a guide use
  `node docs/scripts/registry.ts --review <page>…`. `pnpm docs:build` checks both, with stale items as warnings.
- store and react-store: API Extractor guards their public API (`etc/*.api.md`, checked by `lint:check`); after an
  intended API change run `pnpm --filter <package> api:report` and commit the report.
- Never commit, push or publish unless asked.
