// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AccordionItemMachine } from '~@components/accordion/item/AccordionItemMachine';
import { AccordionMachine } from '~@components/accordion/root/AccordionMachine';
import { AvatarFallbackDelay } from '~@components/avatar/fallback/AvatarFallbackDelay';
import { AvatarImageLoader } from '~@components/avatar/image/AvatarImageLoader';
import { AvatarMachine } from '~@components/avatar/root/AvatarMachine';
import { CheckboxMachine } from '~@components/checkbox/root/CheckboxMachine';
import { CollapsibleMachine } from '~@components/collapsible/root/CollapsibleMachine';
import { ComboboxRootMachine } from '~@components/combobox/root/ComboboxRootMachine';
import { ContextMenuRootMachine } from '~@components/context-menu/root/ContextMenuRootMachine';
import { ContextMenuTriggerMachine } from '~@components/context-menu/trigger/ContextMenuTriggerMachine';
import { DialogPopupMachine } from '~@components/dialog/popup/DialogPopupMachine';
import { DialogRootMachine } from '~@components/dialog/root/DialogRootMachine';
import { DialogTriggerMachine } from '~@components/dialog/trigger/DialogTriggerMachine';
import { DrawerDragMachine } from '~@components/drawer/drag/DrawerDragMachine';
import { DrawerRootMachine } from '~@components/drawer/root/DrawerRootMachine';
import { MarqueeMachine } from '~@components/marquee/root/MarqueeMachine';
import { MenuPopupMachine } from '~@components/menu/popup/MenuPopupMachine';
import { MenuPositionerMachine } from '~@components/menu/positioner/MenuPositionerMachine';
import { MenuRootMachine } from '~@components/menu/root/MenuRootMachine';
import { MenuTriggerMachine } from '~@components/menu/trigger/MenuTriggerMachine';
import { MenubarMachine } from '~@components/menubar/root/MenubarMachine';
import { NavigationMenuContentMachine } from '~@components/navigation-menu/content/NavigationMenuContentMachine';
import { NavigationMenuListMachine } from '~@components/navigation-menu/list/NavigationMenuListMachine';
import { NavigationMenuPositionerMachine } from '~@components/navigation-menu/positioner/NavigationMenuPositionerMachine';
import { NavigationMenuRootMachine } from '~@components/navigation-menu/root/NavigationMenuRootMachine';
import { NavigationMenuTriggerMachine } from '~@components/navigation-menu/trigger/NavigationMenuTriggerMachine';
import { NavigationMenuViewportMachine } from '~@components/navigation-menu/viewport/NavigationMenuViewportMachine';
import { NumberFieldMachine } from '~@components/number-field/root/NumberFieldMachine';
import { PinInputMachine } from '~@components/pin-input/root/PinInputMachine';
import { PopoverPopupMachine } from '~@components/popover/popup/PopoverPopupMachine';
import { PopoverPositionerMachine } from '~@components/popover/positioner/PopoverPositionerMachine';
import { PopoverRootMachine } from '~@components/popover/root/PopoverRootMachine';
import { PopoverTriggerMachine } from '~@components/popover/trigger/PopoverTriggerMachine';
import { RadioMachine } from '~@components/radio/root/RadioMachine';
import { RadioGroupMachine } from '~@components/radio-group/root/RadioGroupMachine';
import { ScrollAreaMachine } from '~@components/scroll-area/root/ScrollAreaMachine';
import { SegmentedControlMachine } from '~@components/segmented-control/root/SegmentedControlMachine';
import { SelectPopupMachine } from '~@components/select/popup/SelectPopupMachine';
import { SelectPositionerMachine } from '~@components/select/positioner/SelectPositionerMachine';
import { SelectRootMachine } from '~@components/select/root/SelectRootMachine';
import { SelectTriggerMachine } from '~@components/select/trigger/SelectTriggerMachine';
import { SliderMachine } from '~@components/slider/root/SliderMachine';
import { SwitchMachine } from '~@components/switch/root/SwitchMachine';
import { TabsListMachine } from '~@components/tabs/list/TabsListMachine';
import { TabsMachine } from '~@components/tabs/root/TabsMachine';
import { TabsTabMachine } from '~@components/tabs/tab/TabsTabMachine';
import { ToastProviderMachine } from '~@components/toast/provider/ToastProviderMachine';
import { ToastViewportMachine } from '~@components/toast/viewport/ToastViewportMachine';
import { ToggleMachine } from '~@components/toggle/root/ToggleMachine';
import { ToggleGroupMachine } from '~@components/toggle-group/root/ToggleGroupMachine';
import { ToolbarMachine } from '~@components/toolbar/root/ToolbarMachine';
import { TooltipPopupMachine } from '~@components/tooltip/popup/TooltipPopupMachine';
import { TooltipPositionerMachine } from '~@components/tooltip/positioner/TooltipPositionerMachine';
import { TooltipProviderMachine } from '~@components/tooltip/provider/TooltipProviderMachine';
import { TooltipRootMachine } from '~@components/tooltip/root/TooltipRootMachine';
import { TooltipTriggerMachine } from '~@components/tooltip/trigger/TooltipTriggerMachine';

const RENDER_METHOD = /^get(State|\w*Props)$/;

/**
 * What a server render does with a machine: reads its state and props. Calls `getState()` and every
 * `get*Props()` that can be called without arguments.
 */
function render(machine: object) {
    const proto = Object.getPrototypeOf(machine) as Record<string, unknown>;
    const names = new Set<string>();
    for (let p: object | null = proto; p && p !== Object.prototype; p = Object.getPrototypeOf(p)) {
        for (const name of Object.getOwnPropertyNames(p)) {
            names.add(name);
        }
    }
    for (const name of Object.keys(machine)) {
        names.add(name);
    }
    const called: string[] = [];
    for (const name of names) {
        if (!RENDER_METHOD.test(name)) {
            continue;
        }
        const method = (machine as Record<string, unknown>)[name];
        if (typeof method === 'function' && method.length === 0) {
            method.call(machine);
            called.push(name);
        }
    }
    return called;
}

function renderAll(...machines: object[]) {
    for (const machine of machines) {
        render(machine);
    }
}

describe('server rendering (no DOM, never connected)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // Each test ends by checking that nothing was scheduled: a server never connects, so it would leak.

    it('runs without a DOM', () => {
        expect(typeof globalThis.document).toBe('undefined');
        expect(typeof globalThis.window).toBe('undefined');
    });

    it('renders popups', () => {
        const popover = new PopoverRootMachine({ defaultOpen: true }, { fallbackReferenceId: 'ref' });
        const popoverPositioner = new PopoverPositionerMachine(popover.store, { nodeId: 'node', tree: popover.tree });
        expect(render(new PopoverTriggerMachine(popover.store, { id: 'trigger' }))).toContain('getTriggerProps');
        renderAll(popoverPositioner, new PopoverPopupMachine(popover.store, { positioner: popoverPositioner }));

        const dialog = new DialogRootMachine({ defaultOpen: true }, { fallbackReferenceId: 'ref' });
        renderAll(new DialogTriggerMachine(dialog.store, { id: 'trigger' }), new DialogPopupMachine(dialog.store));

        const drawer = new DrawerRootMachine({ defaultOpen: true, snapPoints: ['50%', '100%'] }, { fallbackReferenceId: 'ref' });
        renderAll(new DrawerDragMachine(drawer.drawerStore, drawer.store as never, {}));

        const provider = new TooltipProviderMachine({ delay: 100 });
        const tooltip = new TooltipRootMachine({ defaultOpen: true });
        const tooltipPositioner = new TooltipPositionerMachine(tooltip);
        renderAll(
            new TooltipTriggerMachine(tooltip.store, { id: 'trigger' }, { delayGroup: provider.delayGroup }),
            tooltipPositioner,
            new TooltipPopupMachine(tooltip, { positioner: tooltipPositioner as never })
        );

        expect(vi.getTimerCount()).toBe(0);
    });

    it('renders menus', () => {
        const menu = new MenuRootMachine({ defaultOpen: true }, { rootId: 'root', fallbackReferenceId: 'ref', nodeId: 'node' });
        const positioner = new MenuPositionerMachine(menu);
        renderAll(
            new MenuTriggerMachine(menu.store, { id: 'trigger' }),
            positioner,
            new MenuPopupMachine(menu, { positioner: positioner as never })
        );

        const contextMenu = new ContextMenuRootMachine({}, { rootId: 'ctx', fallbackReferenceId: 'ref', nodeId: 'ctx-node' });
        renderAll(new ContextMenuTriggerMachine(contextMenu), new MenuPositionerMachine(contextMenu.menu));

        renderAll(new MenubarMachine({}, { id: 'menubar', nodeId: 'menubar-node' }));

        const nav = new NavigationMenuRootMachine({ defaultValue: 'products' }, { nodeId: 'nav' });
        renderAll(
            nav,
            new NavigationMenuListMachine(nav),
            new NavigationMenuTriggerMachine(nav, 'products'),
            new NavigationMenuPositionerMachine(nav),
            new NavigationMenuViewportMachine(nav, true),
            new NavigationMenuContentMachine(nav, 'products')
        );

        expect(vi.getTimerCount()).toBe(0);
    });

    it('renders selection components', () => {
        const select = new SelectRootMachine({ defaultOpen: true }, { defaultId: 'select' });
        const positioner = new SelectPositionerMachine(select, { alignItemWithTrigger: false });
        renderAll(select, new SelectTriggerMachine(select), positioner, new SelectPopupMachine(select, { positioner }));

        renderAll(new ComboboxRootMachine({ items: ['a', 'b'], defaultOpen: true }, { defaultId: 'cb' }));

        expect(vi.getTimerCount()).toBe(0);
    });

    it('renders controls and layout components', () => {
        const avatar = new AvatarMachine();
        new AvatarImageLoader(avatar, { src: '/avatar.png' });
        new AvatarFallbackDelay(100);

        const accordion = new AccordionMachine({ defaultValue: ['a'] });
        const tabs = new TabsMachine({ defaultValue: 'one' });
        const tabsList = new TabsListMachine(tabs);
        const radioGroup = new RadioGroupMachine({ id: 'rg', name: 'size' });
        const toggleGroup = new ToggleGroupMachine({ defaultValue: ['bold'] });
        const toasts = new ToastProviderMachine({ timeout: 1000 });

        renderAll(
            avatar,
            accordion,
            new AccordionItemMachine(accordion, { value: 'a', fallbackValue: 'a', defaultTriggerId: 'ta', defaultPanelId: 'pa' }),
            tabs,
            tabsList,
            new TabsTabMachine(tabs, tabsList, { id: 'tab-one', value: 'one' }),
            new CheckboxMachine({ defaultId: 'cb', name: 'agree' }),
            new SwitchMachine({ defaultId: 'sw', defaultInputId: 'sw-input', defaultChecked: true }),
            radioGroup,
            new RadioMachine({ value: 'small', group: radioGroup, defaultId: 'r1', defaultInputId: 'r1-input' }),
            toggleGroup,
            new ToggleMachine({ value: 'bold', group: toggleGroup }),
            new CollapsibleMachine({ defaultPanelId: 'panel', defaultOpen: true }),
            new ScrollAreaMachine(),
            new MarqueeMachine(),
            new SliderMachine({ id: 'slider', defaultValue: [20, 80] }),
            new NumberFieldMachine({ defaultId: 'nf', defaultValue: 5 }),
            new PinInputMachine({ id: 'pin' }),
            new SegmentedControlMachine({ id: 'sc', defaultValue: 'list' }),
            new ToolbarMachine(),
            toasts,
            new ToastViewportMachine(toasts)
        );

        expect(vi.getTimerCount()).toBe(0);
    });
});
