# Plan: tracking the freshness of the documentation and its translations

For the agent implementing it. Read `AGENTS.md` at the root, `docs/README.md` and the README section «Storybook and the
API reference» first. Never commit, push or publish; the user does.

## What exists today (do not rebuild it)

The proposal this plan comes from suggests a docs registry, shared translation ids, README → MDX generation and CI
reports. Half of it is already in place:

| Proposal | State in flippo-ui |
| --- | --- |
| One source of truth per kind of information | Done. Props: JSDoc of `packages/react-components`. Attributes and events: JSDoc of `withAttributes` in `packages/web-components` → `custom-elements.json` (Custom Elements Manifest, written by its build, `custom-elements-manifest.config.js`). Data attributes and CSS variables: the `*DataAttributes` / `*CssVars` enums of `packages/core-components`. SCSS: SassDoc `///` comments. TS APIs: TSDoc → TypeDoc; store and react-store also have API Extractor reports (`packages/{store,react-store}/etc/*.api.md`). |
| Shared API data and translation ids for Storybook and Fumadocs | Done. `tools/api-docs.ts` writes `tools/storybook/api.json` (React parts) and `tools/storybook/core-enums.json` (core enums). Both Storybooks (`tools/storybook/DocsPage.tsx`) and the site generators (`docs/scripts/*.ts`) read them and the same keys of `tools/storybook/i18n/{en,ru}.json`: `api.<Family>.<Part>.description\|props.<prop>`, `web.<Class>.<attribute>`, `core.<Enum>.<value>`. |
| Guides as one MDX file per language | Done. `docs/content/docs/**/page.mdx` + `page.ru.mdx` (Fumadocs `dot` convention). Storybook overview pages render markdown files per language (`MarkdownPage` in `tools/storybook/Lang.tsx`); the themes page reads the site's `ui-kit-*/theming*.mdx`. |
| README → `index.mdx` generated at build, not in git | Done. `docs/scripts/readme.ts`; generated pages are git-ignored (`.gitignore`, «Generated pages of the documentation site»). |
| Generation errors block CI | Partly. `pnpm docs:build` (generate + `docs/scripts/check.ts`: MDX compiles, relative links, `meta.json` pages) exists but no workflow runs it yet. `node tools/i18n-check.ts` (in `pnpm lint:check`) fails on missing keys and on `en.json` behind the sources. |

What is missing, and what this plan adds:

1. Translations do not remember which English text they translate: when a JSDoc changes, `--write` prints the keys once,
   then nothing tracks that the Russian text is stale.
2. `*.ru.mdx` pages are not tracked against their English page at all.
3. Hand-written guides are not linked to the API they describe.
4. No CI job reports any of this.
5. Small: a web element or React part whose core enum is named off-convention loses its data attributes silently.

Do not adopt from the proposal: a new `apps/` layout or a `packages/docs-tooling` package (tooling stays in `tools/` and
`docs/scripts/`, Node TypeScript run directly by `node`), hashing whole source files (track the public contract only),
a translation management service or an i18n library (no runtime i18n is involved; the stores are git files).

## Principle: git-first, content hashes, warn before blocking

Every translation records a hash of the English text it was made from, in git, next to the translation. This is the
gettext «fuzzy» flag and MDN's `l10n.sourceCommit` (translated-content), but with a content hash instead of a commit:
it survives squash merges and rebases and needs no git history in CI. A translation is **missing** (no text), **stale**
(the hash differs from the current English text) or **current**. Missing blocks CI (as today); stale is a warning in the
pull request summary until the user decides to make it strict per area.

Hash: `sha256` of the English text normalized (trim, `\r\n` → `\n`), first 12 hex characters. Put the function in one
module and import it everywhere (`tools/docs-hash.ts`, exported by `@flippo-software/workspace-tools` as
`./docs-hash`; `docs` already depends on that package).

## Phase 1: dictionary keys (`tools/storybook/i18n`)

- New file `tools/storybook/i18n/ru.sources.json`: `{ "<key>": "<hash of the en text the ru text translates>" }`,
  sorted keys, 4-space JSON. One entry per key of `ru.json`. Initialize it from the current `en.json` (everything is
  considered reviewed as of the migration); say so in the report to the user.
- `tools/i18n-check.ts`:
  - computes for every key: missing / stale / current;
  - default run (used by `lint:check`): fails on missing keys and on keys present in one dictionary only (as today);
    prints the stale count per prefix (`api`, `web`, `core`, `docs`, stories by family) and the stale keys;
  - `--write`: as today (en.json from the sources), and removes `ru.sources.json` entries of removed keys; it never
    updates a hash;
  - `--review <key|prefix>…`: records the current English hash for those keys (after a human checked or edited the
    Russian text); `--review --all-current` is not provided on purpose;
  - `--json <file>`: writes the status for the CI summary (`{ missing: [], stale: [{ key, en, ru }] }`).
- Document the workflow in `README.md` («Storybook and the API reference», the dictionary list) and in `AGENTS.md`
  (the «Storybook texts» bullet): change a JSDoc → `--write` → fix `ru.json` → `--review <keys>`.

Acceptance: changing one JSDoc sentence in react-components and running `pnpm --filter @flippo-software/workspace-tools
lint:check` passes but lists that key as stale; after `--review` it is current; deleting a ru key fails the check.

## Phase 2: translated pages (`*.ru.mdx`, Storybook markdown)

- Translated pages carry the hash of their English page body in their frontmatter:
  `l10n: { source: <hash> }` (MDN's shape). The body is the file without its frontmatter. Covers
  `docs/content/docs/**/*.ru.mdx`, `packages/ui-kit-*/.storybook/pages/*.ru.md`, `tools/storybook/pages/*.ru.md`.
  A translation of a generated README overview (`<package>/index.ru.mdx`, versioned) hashes the README body after the
  generator's rewriting — hash what `docs/scripts/readme.ts` writes, not the raw README.
- `docs/scripts/check.ts`: reports missing (`l10n` absent) and stale pages next to the existing checks; same exit
  policy as phase 1 (stale = warning). Add `node scripts/check.ts --review <file>…` to update the hash, and
  `--json <file>` for CI.
- Fumadocs must accept the field: when the site is set up (see the Fumadocs instructions given to the user), extend the
  page frontmatter schema with `l10n` (`frontmatterSchema.extend(...)` of `fumadocs-mdx`; check the current API of the
  installed version before writing it). `MarkdownPage` already strips frontmatter; keep it that way.
- Initialize the hashes of the existing translated pages (index, installation, theming ×2, introduction ×2, tokens).

Acceptance: editing a sentence of `docs/content/docs/installation.mdx` makes `pnpm docs:build` report
`installation.ru.mdx` as stale without failing; `--review` clears it.

## Phase 3: guides linked to API contracts (warn-only)

Hand-written guides (not the generated reference) can describe an API that later changes. Track the link, not the
whole source.

- `docs/registry.json`: `{ "<page path>": { "contracts": ["react:Checkbox", "web:checkbox", "core:CheckboxRootDataAttributes", "npm:store"], "reviewed": { "<contract>": "<hash>" } } }`.
- Contract hashes from the structured data that already exists, normalized and without descriptions (descriptions
  are tracked by phase 1):
  - `react:<Family>`: the family in `api.json` — part names, prop names, types, defaults;
  - `web:<name>`: the registered elements of the component in `custom-elements.json` — tags (part keys), attribute
    names, types, defaults, event names and detail types, `cssProperties` names;
  - `core:<Enum>`: the values of the enum in `core-enums.json`;
  - `npm:<package>`: the API Extractor report `packages/<package>/etc/<package>.api.md`.
- `docs/scripts/registry.ts`: computes current hashes, reports «contract changed since the guide was reviewed» per page,
  `--review <page>` records them, `--json` for CI. Pages without an entry are not tracked (no requirement to register).
- Register the existing guides that describe APIs: `ui-kit-*/theming*.mdx` (FlippoProvider / provider and theme
  functions), `installation*.mdx` (entry points).

Acceptance: adding a prop to `CheckboxRoot` reports pages registered on `react:Checkbox`; changing only its JSDoc does
not.

## Phase 4: CI report

- In the pull request workflow (`.github/workflows/`, see `tools/affected.mjs` for how packages are selected), add a
  `docs` job after the build: `pnpm docs:build`, `node tools/i18n-check.ts --json …`, `node docs/scripts/check.ts --json
  …`, `node docs/scripts/registry.ts --json …`, then one script that turns the JSON files into a markdown table in
  `$GITHUB_STEP_SUMMARY` (sections: generated pages OK/failed; translations missing/stale; guides to review).
- Failing: generation or MDX errors, missing translations, broken links. Warnings only: stale translations, guides to
  review. Do not add a bot comment yet; the job summary is enough.
- Run the job when docs inputs change: packages' `src` and READMEs, `tools/`, `docs/`. It needs the packages built.

## Phase 5: no silent loss of data attributes

The web pages (Storybook `DocsPage.tsx` `coreEnumOf`, `docs/scripts/web-components.ts`) and the React ones
(`tools/api-docs.ts` `partEnums`) find a part's enums by name: `<Family><Part>DataAttributes`. Renaming files (an
`attributes.ts` per part) would not help: the link is the name, and the enums need unique names for the `export *`
entry points. Make the convention checked instead:

- In `tools/api-docs.ts`, list every React part and every registered web element (from `custom-elements.json`) whose
  enums are not found, and fail unless it is in an explicit allowlist in the same file (`NO_STATE_ATTRIBUTES`: parts that
  really set none, e.g. `Portal`, `Title`, `Description` — build the list from the current output and review it).
- Share the name resolution between the three places (one exported function in `tools/`, imported by `DocsPage.tsx`
  and by `docs/scripts/web-components.ts`).

## Constraints and checks

- Code style: Biome configs of each folder (`tools/biome.json`, `docs/biome.json`), English doc comments, the comment
  density of the surrounding code. Node scripts are `.ts` run by `node` (type stripping: no enums, no parameter
  properties).
- After each phase: `pnpm check` and `pnpm docs:build` at the root must pass; report the stale counts the first run
  shows.
- Keep the user's decisions: long texts are markdown per language, never dictionary keys; dictionaries keep semantic
  keys; generated pages stay out of git.
