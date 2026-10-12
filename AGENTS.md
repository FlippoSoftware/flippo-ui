# Flippo UI — notes for agents

pnpm workspace of the whole component system: `packages/store`, `core`, `hooks`, `react-components`,
`web-components`, `component-styles`, `ui-kit-react`, `ui-kit-web`, `internal-test-utils` (see README). Packages with
their own `AGENTS.md` (core, react-components, web-components, component-styles…): read it before working there.

- Run commands from the root: `pnpm check` (build → lint → typecheck → test), `pnpm --filter <package> <script>`.
- The kits read component-styles from its sources (`source` export condition, `tools/workspace.ts`): no rebuild is
  needed for their Storybook, tests and typecheck. Lint (Biome resolution) and builds need `pnpm build` first.
- Dependencies between workspace packages: `workspace:*` (dev) / `workspace:^` (peer). Shared tool versions: the
  `catalog` in `pnpm-workspace.yaml` (`"catalog:"` in package.json).
- The behaviour packages (store, core, hooks, react-components, web-components) are consumed from `dist`: rebuild
  them after a change (`pnpm build`, or keep `pnpm dev` running). Their internal imports use tsconfig `paths`
  aliases (`~@lib/*`), so their sources cannot be read by other packages.
- hooks and internal-test-utils build their types with TypeScript 5 (vite-plugin-dts, tsup); the rest use TypeScript 7.
- Never commit, push or publish unless asked.
