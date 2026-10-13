# @flippo-software/ui-kit-react

Styled React 19 adapters over `@flippo-software/react-components`. Behaviour, accessibility and state stay in the headless adapters/core; classes, variants, tokens and CSS come from `@flippo-software/component-styles`.

This is the former `flippo-components` repository (then `styled-react-components`). Its old component SCSS modules have been replaced by shared recipes.

## Install

`@flippo-software/component-styles` is a peer dependency: install it next to the kit, so the application has one copy
of the styles (shared with `@flippo-software/ui-kit-web` and with your own components built on the same recipes).

```sh
pnpm add @flippo-software/ui-kit-react @flippo-software/component-styles react react-dom
```

## Usage

Import the stylesheet once at the application entry point. JavaScript imports have no CSS side effects, including during SSR.

```tsx
import '@flippo-software/ui-kit-react/styles.css';
import { Button, Card, Text, Dialog } from '@flippo-software/ui-kit-react';

export function Example() {
    return <Card.Root>
        <Card.Content>
            <Card.Title>Profile</Card.Title>
            <Text color="secondary">Shared styles in React and custom elements.</Text>
            <Dialog.Root size="medium">
                <Dialog.Trigger render={<Button />}>Edit</Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Popup>
                        <Dialog.Title>Edit profile</Dialog.Title>
                        <Dialog.Description>Change your profile details.</Dialog.Description>
                        <Dialog.Close>Close</Dialog.Close>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
        </Card.Content>
    </Card.Root>;
}
```

Each family also has a separate entry point, e.g. `import { Dialog } from '@flippo-software/ui-kit-react/dialog'`. Instead of the aggregate stylesheet, applications can import `component-styles/css/base.css`, `fonts.css` and the component stylesheets they use (including the composed recipes' stylesheets).

Recipe variants are props: `size`, `variant`, `appearance`, etc. A compound family's `Root` provides variants to its parts through React context, including portals. A part can override them locally. Behavioural `orientation` also reaches the headless component. Native `size` on controls is reserved for the visual size; use the headless adapter directly if you need the native HTML attribute.

`ref`, headless `render`, events and string/function `className` are forwarded. Generic Select/Combobox roots retain the relation between `value`, `multiple` and `onValueChange`.

## Default props

`DefaultPropsProvider` sets the default props of the kit's families for its subtree (like Gravity UI's
`DefaultPropsProvider`). A family's key is its name in camelCase (`button`, `select`, `segmentedControl`); its entry
holds the props of the root (or of the component itself) and, under a part's name, the props of that part.

```tsx
import { DefaultPropsProvider } from '@flippo-software/ui-kit-react';

<DefaultPropsProvider defaults={{ button: { size: 'small' }, select: { size: 'small', positioner: { sideOffset: 4 } } }}>
    <App />
</DefaultPropsProvider>;
```

A prop set on a component wins, then the part's own entry, then what the root passes down to its parts, then the
family's entry, then the kit's built-in defaults. Nested providers merge with the outer ones, family by family and
part by part. `DefaultProps` types the config from the kit's exports, so a wrong family, prop or value is a type
error. The same config works for `@flippo-software/ui-kit-web` (`define({ defaults })`).

## Inputs

The headless Input and Textarea roots provide control state. Their Slot renders the native control; Body renders its visual container. Control is an alias for Slot. Field.Control is the convenience form that supplies a native slot when no children are given.

```tsx
import { Field, Input, Textarea } from '@flippo-software/ui-kit-react';

<Field.Root name="name">
    <Field.Label>Name</Field.Label>
    <Input.Root defaultValue="Alice" size="small">
        <Input.Body>
            <Input.Slot />
            <Input.Clear />
        </Input.Body>
    </Input.Root>
    <Field.Description>Public display name</Field.Description>
</Field.Root>

<Field.Root name="message">
    <Textarea.Root>
        <Textarea.Body><Textarea.Slot aria-label="Message" /></Textarea.Body>
    </Textarea.Root>
</Field.Root>
```

Clear goes through the native input event so value changes and validation still belong to Field. Icons and indicator contents are supplied as children. Menu.LinkItem accepts the same `render` prop as Menu.Item; use `render={<a href="…" />}` for links. Menubar is callable and also exposes `Root` and `Trigger`, to use with Menu.Root.

## Presentation and layout

Both styled packages include Card (Root, Content, Footer, Title, Description), Text, Code, Kbd, Blockquote, Em, Strong, Quote, Box, Flex, Grid (Root, Item), Center, Container, Section, List, Skeleton and Spinner. Both also expose SkeletonText, with configurable line count and gap. Its mask and animation are shared CSS.

Text supports the shared typography `size`/`weight` scale, semantic `color`, alignment and truncation. Presentation components support `as`, native attributes and refs. Layout props retain `m`, `px`, `width`, `grow`, `columns`, `colSpan`, `spacing`, etc. Their conversion is shared in `component-styles/layouts`; numeric `spacing` uses `--fl-spacing-*`. Container/Section defaults and sizes live in CSS, so their CSS hooks remain effective.

All 43 original recipe families are included, including Autocomplete, Combobox, CheckboxCard, RadioCard, NavigationMenu, SegmentedControl, Snippet and QrCode. All headless utility exports remain available from the package root.

## Migration

- Replace the old package name and stylesheet import. `--f-*` variables are replaced by the shared `--fl-*` tokens/hooks.
- Import React components directly: `import { Button } from '…'`, then `<Button />`. Compound components use `<Dialog.Root />`, `<Grid.Root />`, etc.
- Variants follow `component-styles` recipes. Button's `iconOnly` replaces `icon` (the alias is retained); `href`, `loading` and `loader` are retained. Old `corners` and unrelated Radix token overrides are not part of the new recipe API.
- Typography and feedback components now use Flippo tokens, including Code/Kbd, which previously referenced undefined tokens from a different theme.
- Stories live in `src/components/<Name>/__stories__/`, tests in `__tests__/` folders next to the code they test
  (`src/__tests__/` for the kit as a whole). Both import the kit from `~@src` (tsconfig `paths`, `aliases.ts` for Vite).

## Local development

This package is part of the `ui-kit` pnpm workspace (see the root README): install and run the checks from the root
(`pnpm install`, `pnpm check`), or one package with `pnpm --filter @flippo-software/ui-kit-react <script>`. It reads
`component-styles` from its sources in Storybook, tests and typecheck, so style changes show up without a build.
The behaviour packages it uses (react-components, core, hooks, store) come from the workspace and their `dist`:
rebuild them after a change (`pnpm build`, or keep `pnpm dev` running at the root).

## Storybook

Each component keeps its stories next to it, in `src/components/<name>/__stories__/` (one CSF page for each of the 63
public component families), in Russian, with the same
catalog groups and content in both packages. Each page has a `Default` story with Controls for the recipe variants,
and a `Gallery` (some also `Examples`) laid out like the Figma component sheets: sections of labelled rows with the
sizes, variants and states, and realistic compositions from the Flippo screens. The gallery layout (`src/__stories__`, imported as `~@stories`)
and its CSS (`.storybook/preview.css`, `.sb-*` classes) are shared by both packages. The toolbar switches light/dark
themes (dark by default), including overlays in the top layer.

```sh
pnpm install
pnpm storybook
# Static output in storybook-static/
pnpm build-storybook
```

React runs on port **6006**. The Storybook Vite config is separate from the library build.
