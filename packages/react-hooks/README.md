# @flippo-software/react-hooks

Generic React hooks used by [`@flippo-software/react-components`](../react-components) and by apps, and the React
adapter of [`@flippo-software/store`](../store): `useStore` and `ReactStore`.

> **Status: not yet released.** Formerly `@flippo-ui/hooks`.

## Install

```sh
pnpm add @flippo-software/react-hooks
```

React 19 (`react`, `react-dom`) is a peer dependency.

## Import

```tsx
import { useMediaQuery, useStore } from '@flippo-software/react-hooks';

// Or one hook per entry point (kebab-case names):
import { useMediaQuery } from '@flippo-software/react-hooks/use-media-query';
```

## The store in React

`useStore` subscribes a component to a slice of any `Store`; `ReactStore` is a `ComponentStore` with hooks for
components built on it. A component re-renders only when the value it selected changes.

```tsx
import { ReactStore, type Store, useStore } from '@flippo-software/react-hooks';

function Counter({ store }: { store: Store<{ count: number }> }) {
    const count = useStore(store, (state) => state.count);
    return <span>{count}</span>;
}
```

A component store belongs to one instance of the component: the root creates it once (`useState` with an
initializer, not at module level, so every instance and every server request gets its own) and passes it to its
parts through context:

```tsx
type PopoverStore = ReactStore<PopoverState, PopoverStoreContext, typeof selectors>;

const PopoverContext = React.createContext<PopoverStore | null>(null);

function PopoverRoot(props: PopoverRootProps) {
    const [store] = React.useState(() => new ReactStore(initialState, initialContext, selectors));
    store.useControlledProp('open', props.open); // controlled or uncontrolled `open`
    store.useContextCallback('onOpenChange', props.onOpenChange); // always the latest callback
    return <PopoverContext.Provider value={store}>{props.children}</PopoverContext.Provider>;
}

function PopoverTrigger() {
    const store = React.useContext(PopoverContext)!;
    const open = store.useState('open');
    const setTrigger = store.useStateSetter('triggerElement'); // stable ref callback
    return <button ref={setTrigger} aria-expanded={open} />;
}
```

The package re-exports `Store`, `ComponentStore` and the selector helpers of `@flippo-software/store`, so an app
uses one copy of the store (the notification queue is module state).

## Hooks

| Area | Hooks |
| --- | --- |
| State and refs | `useControlledState`, `usePreviousValue`, `useValueChanged`, `useLatestRef`, `useLazyRef`, `useValueAsRef`, `useRefAsState`, `useMergedRef`, `useForcedRerendering`, `useLocalStorage` |
| Callbacks and effects | `useEventCallback`, `useStableCallback`, `useEnhancedEffect`, `useIsoLayoutEffect`, `useDidUpdate`, `useOnMount`, `useOnFirstRender`, `useIsFirstRender`, `useUnmount`, `useTimeout`, `useInterval`, `useAnimationFrame` |
| Events and input | `useEventListener`, `useWindowEvent`, `useClickOutside`, `useEnhancedClickHandler`, `useHotkeys`, `useHover`, `useLongPress`, `useMouse`, `useMove`, `useDragGesture`, `useTextSelection` |
| Focus | `useFocus`, `useFocusWithin`, `useFocusTrap`, `useFocusReturn`, `useOpenInteractionType` |
| Layout and viewport | `useMediaQuery`, `useViewportSize`, `useWindowScroll`, `useScrollIntoView`, `useScrollLock`, `useScrollSpy`, `useResizeObserver`, `useMutationObserver`, `useIntersection`, `useInViewport`, `useOrientation` |
| Transitions | `useTransitionStatus`, `useStatusTransition`, `useAnimationsFinished`, `useOpenChangeComplete` |
| Browser | `useClipboard`, `useColorSchema`, `useDocumentTitle`, `useFavicon`, `useFileDialog`, `useEyeDropper`, `useFullscreen`, `useHash`, `useIdle`, `useNetwork`, `useOs`, `useSsr`, `useId` |

Examples:

```tsx
const isWide = useMediaQuery('(min-width: 60rem)');

const [open, setOpen] = useControlledState({ prop: props.open, defaultProp: false, onChange: props.onOpenChange });

const ref = useMergedRef(forwardedRef, localRef);

useHotkeys([['mod+K', openSearch]]);
```

## Development

This package is part of the [`flippo-ui`](../../README.md) pnpm workspace: run the commands from the root
(`pnpm --filter @flippo-software/react-hooks <script>`). `pnpm build` runs Vite, then `scripts/generate-exports.js`,
which writes the `exports` of `package.json` (one entry point per hook). The types are built with TypeScript 5
(`vite-plugin-dts`). [`AGENTS.md`](./AGENTS.md) maps the source.
