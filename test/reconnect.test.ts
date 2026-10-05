import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CollapsibleMachine } from '~@components/collapsible/root/CollapsibleMachine';
import { DialogPopupMachine } from '~@components/dialog/popup/DialogPopupMachine';
import { DialogRootMachine } from '~@components/dialog/root/DialogRootMachine';
import { DialogTriggerMachine } from '~@components/dialog/trigger/DialogTriggerMachine';
import { MenuPopupMachine } from '~@components/menu/popup/MenuPopupMachine';
import { MenuPositionerMachine } from '~@components/menu/positioner/MenuPositionerMachine';
import { MenuRootMachine } from '~@components/menu/root/MenuRootMachine';
import { MenuTriggerMachine } from '~@components/menu/trigger/MenuTriggerMachine';
import { PopoverPopupMachine } from '~@components/popover/popup/PopoverPopupMachine';
import { PopoverPositionerMachine } from '~@components/popover/positioner/PopoverPositionerMachine';
import { PopoverRootMachine } from '~@components/popover/root/PopoverRootMachine';
import { PopoverTriggerMachine } from '~@components/popover/trigger/PopoverTriggerMachine';
import { ScrollAreaMachine } from '~@components/scroll-area/root/ScrollAreaMachine';
import { SelectPopupMachine } from '~@components/select/popup/SelectPopupMachine';
import { SelectPositionerMachine } from '~@components/select/positioner/SelectPositionerMachine';
import { SelectRootMachine } from '~@components/select/root/SelectRootMachine';
import { SelectTriggerMachine } from '~@components/select/trigger/SelectTriggerMachine';
import { ToastProviderMachine } from '~@components/toast/provider/ToastProviderMachine';
import { TooltipPopupMachine } from '~@components/tooltip/popup/TooltipPopupMachine';
import { TooltipPositionerMachine } from '~@components/tooltip/positioner/TooltipPositionerMachine';
import { TooltipProviderMachine } from '~@components/tooltip/provider/TooltipProviderMachine';
import { TooltipRootMachine } from '~@components/tooltip/root/TooltipRootMachine';
import { TooltipTriggerMachine } from '~@components/tooltip/trigger/TooltipTriggerMachine';
import { createChangeEventDetails } from '~@events/changeEventDetails';
import { REASONS } from '~@events/reasons';

import type { Connectable } from '~@lib/Connectable';

/**
 * Counts event listeners that are currently attached anywhere.
 */
function trackListeners() {
    const active = new Map<EventTarget, Set<string>>();
    const key = (type: string, listener: unknown, options?: boolean | EventListenerOptions) => {
        const capture = typeof options === 'boolean' ? options : Boolean(options?.capture);
        return `${type}|${capture}|${listenerIds.get(listener as object) ?? register(listener)}`;
    };
    const listenerIds = new WeakMap<object, number>();
    let nextId = 0;
    const register = (listener: unknown) => {
        nextId += 1;
        listenerIds.set(listener as object, nextId);
        return nextId;
    };

    // Elements, `document` and `window` may not share the global `EventTarget.prototype` (happy-dom), so
    // patch the prototype each of them actually inherits the methods from.
    const owners = new Set<EventTarget>();
    for (const target of [document.createElement('div'), document, window] as EventTarget[]) {
        let proto: object | null = target;
        while (proto && !Object.hasOwn(proto, 'addEventListener')) {
            proto = Object.getPrototypeOf(proto);
        }
        if (proto) {
            owners.add(proto as EventTarget);
        }
    }
    for (const owner of owners) {
        const { addEventListener, removeEventListener } = owner;
        vi.spyOn(owner, 'addEventListener').mockImplementation(function (this: EventTarget, type, listener, options) {
            // happy-dom tracks `{ signal }` listeners with an `abort` listener on the (short-lived) signal.
            if (listener && !(this instanceof AbortSignal)) {
                let set = active.get(this);
                if (!set) {
                    set = new Set();
                    active.set(this, set);
                }
                set.add(key(type, listener, options));
            }
            addEventListener.call(this, type, listener, options);
        });
        vi.spyOn(owner, 'removeEventListener').mockImplementation(function (this: EventTarget, type, listener, options) {
            if (listener) {
                active.get(this)?.delete(key(type, listener, options));
            }
            removeEventListener.call(this, type, listener, options);
        });
    }

    return {
        count: () => [...active.values()].reduce((sum, set) => sum + set.size, 0),
        describe: () =>
            [...active].flatMap(([target, set]) =>
                [...set].map((entry) => `${(target as Node).nodeName ?? target.constructor.name} ${entry}`)
            )
    };
}

/**
 * Mounts parts like React does in StrictMode: refs are attached first, then effects connect children
 * before parents, then everything is disconnected and connected again.
 *
 * @param parts Parent first.
 * @returns Unmount.
 */
function strictMount(...parts: Connectable[]) {
    const childrenFirst = [...parts].reverse();
    for (const part of childrenFirst) {
        part.connect();
    }
    for (const part of parts) {
        part.disconnect();
    }
    for (const part of childrenFirst) {
        part.connect();
    }
    return () => {
        for (const part of parts) {
            part.disconnect();
        }
    };
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, parent: Element = document.body) {
    const node = document.createElement(tag);
    parent.append(node);
    return node;
}

function click(handler: ((event: MouseEvent) => void) | undefined, target: Element) {
    const event = new MouseEvent('click', { detail: 1, bubbles: true });
    Object.defineProperty(event, 'currentTarget', { value: target });
    handler?.(event);
}

function pressEscape() {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

describe('reconnection (React StrictMode)', () => {
    let listeners: ReturnType<typeof trackListeners>;

    beforeEach(() => {
        globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
        listeners = trackListeners();
    });

    afterEach(() => {
        globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = false;
        vi.restoreAllMocks();
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    it('popover: opens from the trigger, closes on Escape, leaves no listeners', () => {
        const root = new PopoverRootMachine({}, { fallbackReferenceId: 'ref' });
        const trigger = new PopoverTriggerMachine(root.store, { id: 'trigger' });
        const positioner = new PopoverPositionerMachine(root.store, { nodeId: 'node', tree: root.tree });
        const popup = new PopoverPopupMachine(root.store, { positioner });
        const triggerElement = element('button');
        const positionerElement = element('div');
        trigger.setElement(triggerElement);
        positioner.setElement(positionerElement);
        popup.setElement(element('div', positionerElement));

        const unmount = strictMount(root, trigger, positioner, popup);

        expect(root.store.context.triggerElements.getById('trigger')).toBe(triggerElement);
        click(trigger.getTriggerProps().onClick as never, triggerElement);
        expect(root.store.select('open')).toBe(true);
        expect(root.store.select('activeTriggerId')).toBe('trigger');

        pressEscape();
        expect(root.store.select('open')).toBe(false);

        unmount();
        expect(root.store.context.triggerElements.size).toBe(0);
        expect(listeners.describe()).toEqual([]);
    });

    it('dialog: opens from the trigger and closes on Escape', () => {
        const root = new DialogRootMachine({}, { fallbackReferenceId: 'ref' });
        const trigger = new DialogTriggerMachine(root.store, { id: 'trigger' });
        const popup = new DialogPopupMachine(root.store);
        const triggerElement = element('button');
        trigger.setElement(triggerElement);
        popup.setElement(element('div'));

        const unmount = strictMount(root, trigger, popup);

        click(trigger.getTriggerProps().onClick as never, triggerElement);
        expect(root.store.select('open')).toBe(true);
        pressEscape();
        expect(root.store.select('open')).toBe(false);

        unmount();
        expect(listeners.describe()).toEqual([]);
    });

    it('menu: opens from the trigger and closes on Escape', () => {
        const root = new MenuRootMachine({}, { rootId: 'root', fallbackReferenceId: 'ref', nodeId: 'node' });
        const trigger = new MenuTriggerMachine(root.store, { id: 'trigger' });
        const positioner = new MenuPositionerMachine(root);
        const popup = new MenuPopupMachine(root, { positioner: positioner as never });
        const triggerElement = element('button');
        const positionerElement = element('div');
        trigger.setElement(triggerElement);
        positioner.setElement(positionerElement);
        popup.setElement(element('div', positionerElement));

        const unmount = strictMount(root, trigger, positioner, popup);

        expect(root.store.context.triggerElements.getById('trigger')).toBe(triggerElement);
        root.store.setOpen(true, createChangeEventDetails(REASONS.triggerPress, undefined, triggerElement));
        expect(root.store.select('open')).toBe(true);
        pressEscape();
        expect(root.store.select('open')).toBe(false);

        unmount();
        expect(listeners.describe()).toEqual([]);
    });

    it('select: opens from the trigger and closes on Escape', () => {
        const root = new SelectRootMachine({}, { defaultId: 'select' });
        const trigger = new SelectTriggerMachine(root);
        const positioner = new SelectPositionerMachine(root, { alignItemWithTrigger: false });
        const popup = new SelectPopupMachine(root, { positioner });
        const triggerElement = element('button');
        const positionerElement = element('div');
        trigger.setElement(triggerElement);
        positioner.setElement(positionerElement);
        popup.setElement(element('div', positionerElement));

        const unmount = strictMount(root, trigger, positioner, popup);

        click(trigger.getTriggerProps().onClick as never, triggerElement);
        expect(root.store.state.open).toBe(true);
        pressEscape();
        expect(root.store.state.open).toBe(false);

        unmount();
        expect(listeners.describe()).toEqual([]);
    });

    it('tooltip: keeps the trigger registered and closes on Escape', () => {
        const provider = new TooltipProviderMachine({ delay: 100 });
        const root = new TooltipRootMachine({});
        const trigger = new TooltipTriggerMachine(root.store, { id: 'trigger' }, { delayGroup: provider.delayGroup });
        const positioner = new TooltipPositionerMachine(root);
        const popup = new TooltipPopupMachine(root, { positioner: positioner as never });
        const triggerElement = element('button');
        trigger.setElement(triggerElement);

        const unmount = strictMount(provider, root, trigger, positioner, popup);

        expect(root.store.context.triggerElements.getById('trigger')).toBe(triggerElement);
        root.store.setOpen(true, createChangeEventDetails(REASONS.triggerFocus, undefined, triggerElement));
        expect(root.getOpenState()).toBe(true);
        pressEscape();
        expect(root.getOpenState()).toBe(false);

        unmount();
        expect(listeners.describe()).toEqual([]);
    });

    it('toast provider: keeps auto-dismiss timers across a reconnection', () => {
        vi.useFakeTimers();
        const provider = new ToastProviderMachine({ timeout: 1000 });
        provider.connect();
        provider.add({ title: 'Saved' });
        vi.advanceTimersByTime(400);

        provider.disconnect();
        vi.advanceTimersByTime(5000);
        expect(provider.store.state.toasts).toHaveLength(1);

        provider.connect();
        vi.advanceTimersByTime(700);
        expect(provider.store.state.toasts[0]?.transitionStatus).toBe('ending');

        provider.disconnect();
    });

    it('scroll area reattaches its DOM effects', () => {
        const scrollArea = new ScrollAreaMachine();
        const root = element('div');
        const viewport = element('div', root);
        scrollArea.setRoot(root);
        scrollArea.setViewport(viewport);
        scrollArea.setContent(element('div', viewport));
        scrollArea.setScrollbar('vertical', element('div', root));

        const unmount = strictMount(scrollArea);
        expect(listeners.count()).toBeGreaterThan(0);

        unmount();
        expect(listeners.describe()).toEqual([]);
    });

    it('collapsible leaves no listeners', () => {
        const collapsible = new CollapsibleMachine({ defaultPanelId: 'panel', defaultOpen: true });
        const unmount = strictMount(collapsible);
        collapsible.setOptions({ defaultPanelId: 'panel', open: false });
        unmount();
        expect(listeners.describe()).toEqual([]);
    });
});
