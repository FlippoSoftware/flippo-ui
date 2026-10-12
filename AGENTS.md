# Flippo UI kits — notes for agents

pnpm workspace: `packages/component-styles` (tokens, CSS, recipes), `packages/ui-kit-react`, `packages/ui-kit-web`.
Each package has its own README (and `component-styles/AGENTS.md`); read them before working there.

- Run commands from the root: `pnpm check` (build → lint → typecheck → test), `pnpm --filter <package> <script>`.
- The kits read component-styles from its sources (`source` export condition, `tools/workspace.ts`): no rebuild is
  needed for their Storybook, tests and typecheck. Lint (Biome resolution) and builds need `pnpm build` first.
- Dependencies between workspace packages: `workspace:*` (dev) / `workspace:^` (peer). Shared tool versions: the
  `catalog` in `pnpm-workspace.yaml` (`"catalog:"` in package.json).
- The behaviour packages are sibling repositories (`../core`, `../headless-components`, `../web-components`,
  `../store`), linked with `link:../../../<repo>`; rebuild them after changing them.
- Never commit, push or publish unless asked.
