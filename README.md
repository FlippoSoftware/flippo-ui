# Flippo UI

The Flippo UI component system in one pnpm workspace: the behaviour of the components (state machines and their React
and custom element adapters), the shared styles of the design system and the two UI kits built on them. Each package
is versioned and published on its own.

| Package | What it is |
| --- | --- |
| [`packages/store`](packages/store) · `@flippo-software/store` | Reactive stores, no DOM, no framework. |
| [`packages/core-components`](packages/core-components) · `@flippo-software/core-components` | Framework-agnostic state machines of every component. |
| [`packages/react-store`](packages/react-store) · `@flippo-software/react-store` | The store in React: `useStore`, `ReactStore`. |
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
pnpm docs:build         # generates and checks the pages of the documentation site (after pnpm build)
```

One package: `pnpm --filter <name> <script>`, e.g. `pnpm --filter @flippo-software/ui-kit-react test`, or run the
script inside its folder. Add a dependency to one package: `pnpm --filter <name> add <dependency>`.

## Storybook and the API reference

Both kits share their Storybook setup in `tools/storybook/`: the theme (Flippo palette, logo, favicon in `assets/`),
the docs page of every component (`DocsPage.tsx`) and the tokens page (`pages/Tokens.mdx`); each kit adds its own
overview pages (`.storybook/pages/*.mdx`: getting started, themes and sizes).

The docs page carries an API reference like Base UI's: every part with its props (or, in the web kit, the attributes
and events of its element), data attributes and CSS variables, then the kit's variants and CSS hooks. Each adapter is
documented from its own sources and from the core it is built on:

- React: the JSDoc of the props of `react-components` (with `@default`), read by `tools/api-docs.ts`
  (`tools/storybook/api.json`, not versioned);
- web: the Custom Elements Manifest of `web-components` (`custom-elements.json`, written by its build from the JSDoc of
  `withAttributes`);
- both: the data attributes and CSS variables of the core machines, their `<Name><Part>DataAttributes` and
  `<Name><Part>CssVars` enums in `core-components` (`tools/storybook/core-enums.json`, written by `tools/api-docs.ts`);
- the kit's variants and CSS hooks: the recipes and stylesheets of `component-styles`.

Document a prop, an attribute or a data attribute in its source and it shows up; the kits' `storybook`,
`build-storybook` and `typecheck` scripts run the generator.

The Storybooks are in English and Russian: the toolbar switches the language of the docs pages, the overview pages
and the stories. The texts live in two dictionaries with the same keys, `tools/storybook/i18n/en.json` and `ru.json`:

- stories: `t('select.sections.sizes.title')` from `~@stories`, called at render time (not in module-level constants,
  or the text cannot follow the language); keys by family and role — `<family>.description`,
  `<family>.sections.<section>.title|description`, `<family>.rows.*`, `<family>.labels.*`, `<family>.placeholders.*`,
  `<family>.content.*` (demo content), `common.*` (texts several families share); the web kit's own wording of a text
  ends in `Web` (`checkbox.descriptionWeb`); `{name}` placeholders take values (`t('pinInput.labels.digit', { number })`);
- the docs page: `docs.*`;
- the API references: `api.<Family>.<Part>.description|props.<prop>` (React; `api.common.props.*` for the props every
  part has), `web.<Class>.<attribute>` (the attributes of the web components, under the class that declares them),
  `core.<Enum>.<value>` (the data attributes and CSS variables, shared by both). The English texts are those of the
  sources: `node tools/i18n-check.ts --write` copies them into `en.json` and lists the keys whose Russian text needs a
  look.

The prose of the overview pages is not in the dictionaries: it is markdown, one document per language
(`.storybook/pages/introduction.md` and `introduction.ru.md`; the themes page renders the documentation site's
`docs/content/docs/ui-kit-*/theming*.mdx`), shown by `<MarkdownPage en={en} ru={ru} />`. `node tools/i18n-check.ts`
(part of `pnpm lint:check`) fails when the dictionaries differ, a story uses an unknown key or `en.json` is behind the
JSDoc.

## Documentation site

`docs/` holds the content of the documentation site, laid out for Fumadocs: hand-written guides (markdown, one file per
language) and reference pages generated from the sources — TypeDoc for store, react-store and core-components, the
JSDoc of react-components, the Custom Elements Manifest of web-components (`custom-elements.json`, written by its
build), SassDoc and the recipes of component-styles, the READMEs. `pnpm docs:build` (after `pnpm build`) generates and checks
them; see `docs/README.md`.

## Working across packages

The behaviour packages are consumed from their `dist`: keep `pnpm dev` running while changing them, and the kits'
Storybook and tests see the new builds.

The kits read `component-styles` from its sources during development: Storybook, Vitest and TypeScript resolve the
`source` export condition (`devExports: 'source'` in `component-styles/tsdown.config.ts`, wiring in
[`tools/workspace.ts`](tools/workspace.ts)). Run a kit's Storybook and edit `packages/component-styles/src/**`: the
open story updates without building `component-styles`. Builds, lint and published packages use `dist`.

## Continuous integration

`.github/workflows/check.yaml` builds once, then runs lint, typecheck and tests in parallel against that build (the
packages use each other's `dist`). `.github/actions/setup` installs pnpm, Node and the dependencies for every job.

- On a pull request it checks the packages the pull request changes **and the packages that depend on them**
  (`tools/affected.mjs`): a change of an API in `core-components` is typechecked and tested in `react-components`,
  `web-components` and the kits too. A change outside `packages/` (lockfile, workspace config, `tools/`, workflows)
  checks everything; a change of Markdown only checks nothing.
- The release workflow calls it first on the whole workspace: nothing is released or published unless it passes.
- In the branch rules of `main`, require the `checks` job only: it sums up the others, and a check skipped by the
  selection still lets the pull request merge.

Locally, the same selection: `pnpm --recursive --filter "...{packages/core-components}" test` (the package and its
dependents), or `pnpm --recursive --filter "...[origin/main]" test` (whatever changed since `main`).

## Versions and releases

Each package has its own version and is released on its own, by [release-please](https://github.com/googleapis/release-please)
from [conventional commits](https://www.conventionalcommits.org) (`.github/workflows/release.yaml`):

1. Commit with a conventional message: `fix(core-components): …` → patch, `feat(core-components): …` → minor, `feat(core-components)!: …` or a
   `BREAKING CHANGE:` footer → major (a minor while the version is `0.x`). The package is the folder the commit
   changes, not the scope: a commit that changes `packages/core-components` and `packages/react-components` releases both.
   `chore`, `docs`, `test`, `refactor`… do not release anything. Pull requests check the messages (commitlint).
2. On each push to `main`, release-please keeps **one release pull request per package** with releasable commits
   since its last release (`chore(main): release core-components 0.2.0`): its next version and its CHANGELOG.
   Nothing else is bumped.
3. Merging one of them tags that package (`core-components-v0.2.0`), creates its GitHub release and publishes it to
   npm. The other release pull requests stay open and keep collecting commits until you merge them.

Release a dependency before the packages that need its new version: when `react-components` uses a new API of
`core-components`, merge the `core-components` release first. `pnpm publish` writes the workspace version of a
dependency into the published package (`workspace:^` → `^0.2.0`), so the other order would publish a dependent that
requires a version not on npm. The publish step checks this (`tools/release-order.mjs`): it publishes the dependencies
of a run first, and stops when a dependency is neither on npm nor in the run (merge its release pull request, then
re-run the failed workflow).

### Changing a package without changing its dependents

In the workspace the dependents use the current code of a package, so a breaking change in `core-components` fails
the checks of `react-components` until it is adapted. That is the point of the monorepo, and the usual ways are:

1. **Adapt the dependents in the same pull request** (the default). Each package still gets its own release pull
   request; release `core-components` first.
2. **Make the change additive.** Add the new API next to the old one and mark the old one `@deprecated`; release
   `core-components`; move the dependents later, at their own pace; remove the old API in a later breaking release.
3. **Pin the dependent to the published version** for a while: in its package.json replace
   `"@flippo-software/core-components": "workspace:^"` with the version from npm (`"^0.1.2"`), then `pnpm install`.
   pnpm links workspace packages only for `workspace:` ranges, so this dependent gets the old `core-components` from
   npm, while the rest of the workspace uses the new one. Return to `workspace:^` when you adapt it. Mind that the
   package from npm brings its own dependencies from npm too (`@flippo-software/store`): two copies of the store
   do not share the notification queue, so keep such a pin short, or force the workspace copy with `overrides` in
   `pnpm-workspace.yaml`.

Publishing is done by the Release workflow only: the `prepublishOnly` script of every package
(`tools/publish-guard.mjs`) refuses `pnpm publish` anywhere else. The one exception is the first publication of a new
package, before npm trusted publishing can be set up for it: build, then
`FLIPPO_FIRST_PUBLISH=1 pnpm --filter <package> publish --access public` (always `pnpm publish`, never `npm publish`:
pnpm replaces the `workspace:` and `catalog:` versions). Afterwards, in the package settings on npmjs.com: trusted
publisher `FlippoSoftware/flippo-ui`, workflow `release.yaml`, and disallow publishing with tokens.

### Prereleases (alpha, beta, rc)

A prerelease is a version like `2.0.0-beta.1`: `^` ranges skip it, and it is published under its identifier as the
npm dist-tag (`beta`), so `pnpm add <package>` keeps installing `latest`; users opt in with `pnpm add <package>@beta`.
To start one, set the package's entry in `release-please-config.json`:

```json
"packages/react-components": {
    "component": "react-components",
    "prerelease": true,
    "versioning": "prerelease",
    "prerelease-type": "beta",
    "release-as": "2.0.0-beta.1"
}
```

- Merge the release pull request, then remove `release-as` (it would propose the same version again). Later
  commits, `feat!` included, only bump the number: `2.0.0-beta.2`, `2.0.0-beta.3`.
- Alpha to beta: `"release-as": "2.0.0-beta.1"` (and `"prerelease-type": "beta"`).
- Stable: `"release-as": "2.0.0"` and remove `prerelease`, `versioning` and `prerelease-type`; remove `release-as`
  after the release.

### Fixes for a previous major

When `2.x` is out and `1.x` still gets fixes, keep a maintenance branch: Actions → **Maintenance branch** → Run
workflow, with the package and the major (`react-components`, `1`). It creates `maintenance/react-components-v1` from
the tag of the last `1.x` release (`react-components-v1.4.2`) and brings into it, in one `ci:` commit, the workflows and
release scripts of `main`: GitHub runs the workflows of the pushed branch, and those of an older tag may not know
maintenance branches yet (`tools/maintenance-branch.mjs`, `--dry-run` to see the plan locally). It pushes with
`RELEASE_PLEASE_TOKEN`, which needs the permission to change workflows.

Fix on `main` first (`fix(react-components): …`), then bring the commit to the branch with
`git cherry-pick -x <sha>` (or a pull request into the branch). The Release workflow runs on `maintenance/**` as on
`main`: release-please opens a release pull request into the branch (its manifest still says `1.4.2`), and merging it
tags `react-components-v1.4.3` and publishes it under the dist-tag `v1`, so `latest` stays on `2.x`
(`pnpm add @flippo-software/react-components@v1`). The branch name must start with `maintenance/`; the dist-tag is
chosen by `tools/dist-tag.mjs`.

A dist-tag set by mistake is fixed without republishing: `npm dist-tag add <package>@<version> latest`.

Versions live in `.release-please-manifest.json`, the packages in `release-please-config.json`. Private packages
(`internal-test-utils`, `workspace-tools`) are not in it and are never released.

Dependencies between packages: `workspace:^` (published as `^<version>`, so a new version of a dependency reaches the
dependents' users without re-releasing them, as long as it stays in range), `workspace:*` for dev dependencies. Shared tool versions are in the
`catalog` of `pnpm-workspace.yaml` (`"typescript": "catalog:"`); a package that needs another version writes it
explicitly (`internal-test-utils` keeps TypeScript 5 for tsup).
