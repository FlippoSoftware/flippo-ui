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
- `@flippo-software/react-hooks` (generic hooks) is its own repository (`../hooks`), a dependency of react-components:
  until its first release it is linked from the sibling checkout (`overrides` in `pnpm-workspace.yaml`; build it there).
- Releases: release-please from conventional commits (`fix(core-components): …`, `feat(ui-kit-react): …`); the package is the
  folder a commit changes. Write commit messages accordingly; never edit versions or CHANGELOGs by hand.
- Imports inside a package: tsconfig `paths` aliases with the `~@` prefix (`~@lib/*`, `~@components/*`; in the kits also
  `~@src`, `~@stories`), never `../..`. Vite/Vitest get the same aliases from the package's `aliases.ts`.
- UI kits: stories in `src/components/<name>/__stories__/`, tests in `__tests__/` next to the code.
- One release pull request per package: release a dependency before its dependents (`tools/release-order.mjs` stops
  the publication otherwise). Pull requests check the changed packages and their dependents (`tools/affected.mjs`).
- Prereleases (`release-as` + `prerelease-type` in `release-please-config.json`) and fixes of an old major (branches
  `maintenance/<component>-v<major>`, created by the Maintenance branch workflow, cherry-picked from `main`): see README «Versions and releases». The npm
  dist-tag comes from `tools/dist-tag.mjs`; never publish a prerelease or an old major under `latest`.
- Packages are published by the Release workflow only (`prepublishOnly` runs `tools/publish-guard.mjs`); never
  publish by hand, never `npm publish` (it would ship `workspace:`/`catalog:` versions).
- Storybook: shared theme, docs page and API generator in `tools/storybook/` and `tools/api-docs.ts` (README «Storybook
  and the API reference»). The API reference comes from the sources, never from the docs page: props in the JSDoc of
  `react-components`, attributes in the JSDoc of `withAttributes` in `web-components` (both with `@default`), data
  attributes and CSS variables in the `<Name><Part>DataAttributes` / `<Name><Part>CssVars` enums of `core-components`
  (the machines set them; both adapters import them from there).
- Storybook texts: by key in `tools/storybook/i18n/en.json` and `ru.json` (same keys), `t('<family>.<role>.<slug>')`
  in stories at render time; after a JSDoc change of react-components run `node tools/i18n-check.ts --write` and
  translate the listed keys in `ru.json`. `pnpm lint:check` fails on a missing or unknown key.
- Documentation site content: `docs/` (README there). Hand-written pages are markdown, one file per language
  (`page.mdx`, `page.ru.mdx`), never dictionary keys; reference pages are generated (`pnpm docs:build` after `pnpm build`) from
  JSDoc/TSDoc, the Custom Elements Manifest of web-components, SassDoc (`///`) of component-styles and the READMEs.
- store and react-store: API Extractor guards their public API (`etc/*.api.md`, checked by `lint:check`); after an
  intended API change run `pnpm --filter <package> api:report` and commit the report.
- Never commit, push or publish unless asked.
