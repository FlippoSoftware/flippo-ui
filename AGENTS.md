# Flippo UI — notes for agents

pnpm workspace of the whole component system: `packages/store`, `core-components`, `react-hooks`, `react-components`,
`web-components`, `component-styles`, `ui-kit-react`, `ui-kit-web`, `internal-test-utils` (see README). Packages with
their own `AGENTS.md` (core-components, react-components, web-components, component-styles…): read it before working there.

- Run commands from the root: `pnpm check` (build → lint → typecheck → test), `pnpm --filter <package> <script>`.
- The kits read component-styles from its sources (`source` export condition, `tools/workspace.ts`): no rebuild is
  needed for their Storybook, tests and typecheck. Lint (Biome resolution) and builds need `pnpm build` first.
- Dependencies between workspace packages: `workspace:^` (dependencies, peers), `workspace:*` (dev). Shared tool versions: the
  `catalog` in `pnpm-workspace.yaml` (`"catalog:"` in package.json).
- The behaviour packages (store, core-components, react-hooks, react-components, web-components) are consumed from `dist`: rebuild
  them after a change (`pnpm build`, or keep `pnpm dev` running). Their internal imports use tsconfig `paths`
  aliases (`~@lib/*`), so their sources cannot be read by other packages.
- react-hooks and internal-test-utils build their types with TypeScript 5 (vite-plugin-dts, tsup); the rest use TypeScript 7.
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
- Never commit, push or publish unless asked.
