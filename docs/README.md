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
