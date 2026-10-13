---
name: core-machine
description: Use when adding or changing a state machine in @flippo-software/core-components (a component part like FooTriggerMachine, a store, interactions). Gives the machine template, the rules (Connectable, OptionsStore, untracked setOptions, afterCommit, attrs, props getters), the tests to write and how to check both adapters.
---

# Adding or changing a core machine

## 1. Find the reference

Read a machine of the same kind before writing one: a simple part (`toggle/root/ToggleMachine.ts`), a popup family
(`popover/` — root, trigger, positioner, popup, arrow), a list (`select/`, `menu/`), a form control (`checkbox/`, with
`field` and `labelable`). Base UI's React implementation is the behavioural reference; the React adapter in
`../headless-components/src/components/<Name>/` shows how the parts are wired.

## 2. Template

```ts
export type FooTriggerOptions = {
    disabled?: boolean | undefined; // document defaults with @default
    onPressedChange?: ((pressed: boolean, eventDetails: FooChangeEventDetails) => void) | undefined;
};

export class FooTriggerMachine extends Connectable {
    readonly store = new Store({ pressed: false });

    private readonly optionsStore = new OptionsStore<FooTriggerOptions>({} as FooTriggerOptions);

    private get options(): FooTriggerOptions {
        return this.optionsStore.state;
    }

    private set options(options: FooTriggerOptions) {
        this.optionsStore.setState(options);
    }

    constructor(root: FooRootMachine, options: FooTriggerOptions) {
        super(); // no side effects here
        this.options = options;
    }

    protected override onConnect() {
        this.addCleanup(effect(() => this.sync())); // listeners, timers, subscriptions only here
    }

    setOptions(options: FooTriggerOptions) {
        // What the machine reads while applying its options is not a dependency of the caller (e.g. an effect).
        untracked(() => {
            this.options = options;
        });
    }

    afterCommit() {} // side effects of option changes (user callbacks, focus…), if any

    setElement = (element: HTMLElement | null) => { /* keep the element, register it */ };

    getState(): FooTriggerState { return { pressed: this.store.state.pressed, disabled: this.options.disabled ?? false }; }

    static attrs(state: FooTriggerState) { return getStyleHookProps(state, fooTriggerStateAttributesMapping); }

    getTriggerProps(elementProps: Props = {}): Props { return mergeProps({ onClick: … }, elementProps); }
}
```

Rules: never call user callbacks from `setOptions` (report from a store listener or in `afterCommit`); measure,
focus and position only once connected (`whenConnected(element)`); portals are the adapter's job (accept a
`portal` setup option, `null` = none); keep data attributes, CSS variables and state mappings in their own files.

## 3. Wire it

- Export from `src/components/<name>/index.ts` (explicit list).
- New component: add it to `COMPONENTS` in `tsdown.config.ts` and to `src/index.ts`; the build regenerates `exports`.
- Update the tables in `README.md` when the public API changes.

## 4. Test

In `src/components/<name>/<Name>Machines.test.ts`: create the machine, `connected(machine)`, set elements, drive it
through the props' handlers or DOM events, assert state, props and callbacks (including `eventDetails.cancel()`).
Add SSR safety (construct + `setOptions` without connecting) and reconnect cases for machines with listeners.

## 5. Check everything that uses it

```sh
pnpm lint:check && pnpm typecheck && pnpm test && pnpm build
(cd ../headless-components && pnpm test)   # React adapter
(cd ../web-components && pnpm test)        # custom elements
```
If the change alters a machine's API, update both adapters in the same task.
