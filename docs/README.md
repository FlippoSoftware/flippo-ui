# @flippo-software/docs

The content of the Flippo UI documentation site, laid out for [Fumadocs](https://fumadocs.dev) in `content/docs`: one
file per page and language (`installation.mdx`, `installation.ru.mdx`), `meta.json` / `meta.ru.json` for the sidebar.

```sh
pnpm build          # at the root: the generators read the builds of the packages
pnpm docs:build     # at the root: generate the reference pages, then check every page
```

## Hand-written and generated pages

| Pages | Source | In git |
| --- | --- | --- |
| `index`, `installation`, `ui-kit-*/theming` | written here, in markdown, one file per language | yes |
| `<package>/index` | the package's README (`scripts/readme.ts`) | no |
| `store/api`, `react-store/api`, `core-components/api` | TypeDoc + typedoc-plugin-markdown, from `dist/*.d.ts` (`scripts/typedoc.ts`) | no |
| `react-components/api` | the JSDoc of the props (`tools/api-docs.ts` → `tools/storybook/api.json`) and the core enums | no |
| `web-components/api` | the Custom Elements Manifest of the package (`packages/web-components/custom-elements.json`) and the core enums | no |
| `component-styles/api` | the compiled tokens, SassDoc of `scss/`, the class recipes and stylesheets | no |

Change a reference page in its source: the JSDoc of a prop or an attribute (with `@default`), of a member of a core `*DataAttributes`/`*CssVars` enum, the TSDoc of a function,
a `///` comment of the SCSS API, a README. The Russian reference pages take the translations of the Storybook
dictionaries (`tools/storybook/i18n/ru.json`: `api.*`, `web.*`, `core.*`); a page without a translation is shown in English.

Long texts are markdown, never dictionary keys: a page in another language is a file of its own next to the English
one. The Storybook overview pages of the kits render these files too (`MarkdownPage` of `tools/storybook`).

`scripts/check.ts` compiles every page as MDX (GFM, like Fumadocs), checks the relative links between pages
(`./installation.mdx`) and the pages the `meta.json` files list.

## Translation freshness

The dictionaries share `tools/storybook/i18n/ru.sources.json`, one English content hash per Russian key. Change a
source comment → `node tools/i18n-check.ts --write` → translate `ru.json` →
`node tools/i18n-check.ts --review <key|prefix>…` (from the repository root). English/source drift still fails until
`--write` synchronizes it. This command only prunes hashes for removed keys; it never refreshes existing hashes.

Hand-written Russian pages carry `l10n: { source: "<12 hex characters>" }` in their frontmatter. The source is the
English body, excluding frontmatter; CRLF and surrounding whitespace are normalized. This covers this site's
`.ru.mdx` pages and the Storybooks' `.ru.md` pages. Generated API pages use the dictionaries instead. A hand-written
`<package>/index.ru.mdx` tracks the generated English overview after README rewriting, so generate it first.

After checking a translation, run from the repository root:

```sh
node docs/scripts/check.ts --review docs/content/docs/installation.ru.mdx
node tools/i18n-check.ts --review api.Checkbox.Root.props.checked
```

Multiple explicit paths/keys or dictionary prefixes are supported; there is no `--all-current` switch. Missing text,
missing hashes and invalid metadata fail checks; stale translations only warn. A page with no Russian counterpart
continues to use the intentional English fallback. The existing translations were accepted as the migration
baseline, not retranslated or certified as linguistically reviewed.

## Guides and public contracts

`registry.json` registers only guides whose API dependencies should be tracked. Each entry lists `contracts` and the
last `reviewed` hashes. A changed contract warns until the guide is checked and explicitly acknowledged:

```sh
node docs/scripts/registry.ts --review ui-kit-react/theming.mdx
```

Contract kinds:

| Contract | Tracked structure |
| --- | --- |
| `react:<Family>` | Parts, prop names, types and defaults from the shared API JSON |
| `web:<name>` | Registered tags, attributes, events, detail types and CSS property names from the manifest |
| `core:<Enum>` | Data attribute / CSS variable enum values |
| `npm:<package>` | Public API Extractor report (store and react-store) |
| `exports:<package>` | Public package export paths/conditions and peer dependencies |
| `theme:<package>` | Provider/theme public declarations and local types; component-styles also includes sizes, public constant values and the `fl.theme` SCSS arguments |

Descriptions and declaration comments are excluded from contract hashes. The last two kinds extend the original
plan to cover the APIs actually used by the installation and theming guides. Pages without registry entries remain
untracked. `pnpm docs:build` includes the registry check.

## CI and site integration

The PR workflow's `docs` job consumes the workspace build and manifest, then writes missing/stale translation and
changed-contract reports to its job summary. `i18n-check.ts`, `check.ts` and `registry.ts` accept `--json <file>` even
when validation fails. Missing reports or generation/check errors fail the job; stale items only warn.

This package prepares and validates content; it does not contain a runnable Fumadocs application. When that app is
created, extend its installed `fumadocs-mdx` frontmatter schema with `l10n.source` and verify against that version's
API. The current checks compile MDX and validate relative `.mdx` links and sidebar entries; they do not validate
rendered routes, anchor fragments, external links or browser appearance.
