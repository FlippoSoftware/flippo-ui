# Documentation and Storybook audit

Reviewed on 2026-10-18 alongside the implementation of [TRACKING_PLAN.md](TRACKING_PLAN.md).

The foundation is sound: source comments and the Custom Elements Manifest feed a shared API reference, long prose
stays in language-specific markdown, and generated pages stay out of git. The content pipeline is useful today,
but it is not yet a complete bilingual reference or a runnable documentation site.

## Remaining findings

| Priority | Finding and consequence | Evidence / next change |
| --- | --- | --- |
| High | A clean CI checkout cannot build the unpublished hooks dependency. This predates the documentation changes and also affects the new docs job. | [`pnpm-workspace.yaml`](../pnpm-workspace.yaml) forces `@flippo-software/react-hooks` to `link:../hooks`; [setup](../.github/actions/setup/action.yaml) never checks out or builds that sibling. Release the dependency and replace the override, or explicitly provision a pinned hooks checkout and its build in CI. Local validation uses the existing sibling. |
| Medium | Russian web reference pages still contain English element, property and event descriptions; those descriptions are outside translation tracking. | [`web-components.ts`](scripts/web-components.ts) translates attributes and core enums, but uses the other descriptions directly. [`WebPartReference`](../tools/storybook/DocsPage.tsx) does the same. For example, the generated Russian checkbox page opens with “A checkbox: a form control…”. Add semantic dictionary keys for class/property/event descriptions in a separate translation pass. |
| Medium | The web Storybook omits JavaScript properties that have no HTML attribute. | [`WebPartReference`](../tools/storybook/DocsPage.tsx) renders attributes, events and core state only. The site generator additionally reads `element.members`; its checkbox page includes `labelableController`, which the Storybook API does not show. Share the property extraction/rendering contract between consumers. |
| Medium | The React reference does not cover the entire headless package API. | [`api-docs.ts`](../tools/api-docs.ts) publishes families from `ui-kit-react` folders and accepts only function symbols with a `Props` namespace. Headless-only entries such as `Composite`, `CSPProvider`, `LabelableProvider`, `NoSsr`, `use-button` and `use-render` are omitted; `Slot`, created through `createSlot`, has no extracted parts. Keep the kit index separate from a complete headless API inventory. |
| Medium | Props added by the React UI kit are not in its generated API tables. | [`Button.tsx`](../packages/ui-kit-react/src/components/Button/Button.tsx) adds `loading`, `loader` and `icon`; the generator reads only the headless component's props. Extract kit additions as well as recipe variants. |
| Medium | Checking that a core enum exists does not prove that every state attribute is documented. | [`CheckboxCardRootDataAttributes`](../packages/core-components/src/components/checkbox-card/root/CheckboxCardRootDataAttributes.ts) lists five values, while its machine includes field state. The new checks prevent silently missing enums and test the newly added machine contracts; a full member-by-member audit of older enums remains separate work. |
| Scope limit | There is no runnable Fumadocs application in this workspace. | [`docs/package.json`](package.json) provides generation/check scripts. The checker compiles MDX and checks relative `.mdx` paths and sidebar entries; it does not test routing, anchors, external targets or browser appearance. Add the application and its `l10n.source` frontmatter schema when the site is set up. |

## Improvements delivered

- Persistent source hashes for dictionary translations and hand-written translated pages, with explicit named
  review commands. Missing translations or metadata fail; stale translations warn on every subsequent check.
- Public-contract tracking for six installation/theming guides, including package entry points and provider/theme
  APIs. Description-only changes do not invalidate API contracts.
- A documentation CI job and job summary, documentation-aware change selection, and manifest transfer between
  build and verification jobs. This does not resolve the pre-existing external hooks dependency above.
- One core enum resolver shared by the API generator, web Storybook and site. Unknown stateful parts fail generation;
  reviewed stateless exceptions are explicit. Added missing state documentation with adapter-specific differences.
- Regression checks for translation lifecycle, page metadata and review, public-contract changes, enum resolution,
  runtime state attributes, CI selection and summary failure policy.

The migration treats the existing 3,017 dictionary entries and seven prose translations as its starting baseline;
it does not claim that every existing Russian sentence was linguistically reviewed. The 34 newly documented core
attribute/CSS-variable descriptions were translated during this implementation (3,051 dictionary keys in total).

## Validation

- Workspace build, lint, TypeScript checks and all package tests pass after the fixes. Validation used the existing
  installed dependencies (`pnpm_config_verify_deps_before_run=false` avoids pnpm's automatic reinstall in the sandbox).
- The tooling regression suites pass: 22 tools tests, 15 documentation tests and three core runtime attribute tests.
- `pnpm docs:build`: 310 MDX pages compile, seven prose translations are current, and all 22 guide contracts are current.
- Both kits' `build-storybook` production builds pass. Vite still warns about large bundles; no browser interaction or
  screenshot comparison was performed.
- The real JSON reports produce a successful CI summary: zero missing/stale translations, zero guides to review and
  zero validation errors. Workflow YAML parses and includes `docs` in the required aggregate check. GitHub Actions
  itself was not run; the hooks checkout limitation above remains.
