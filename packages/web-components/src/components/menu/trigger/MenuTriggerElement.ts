import { ListRegistryItem } from '@flippo-software/core-components/composite';
import { MenuTriggerMachine } from '@flippo-software/core-components/menu';
import { mergeProps } from '@flippo-software/core-components/props';
import { Store } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';

import { createId } from '../../../lib/createId';
import { MenuPart } from '../root/MenuRootContext';

/**
 * The button that opens the menu.
 *
 * Attributes: `disabled`, `open-on-hover`, `delay` (ms before opening on hover; 100 by default), `close-delay` (ms).
 * State attributes: `data-popup-open` (`data-pressed` when opened by a press), `data-disabled`.
 */
export class MenuTriggerElement extends MenuPart.withAttributes({
    disabled: 'boolean',
    'open-on-hover': 'boolean',
    delay: 'number',
    'close-delay': 'number'
}) {
    private trigger!: MenuTriggerMachine;

    private readonly generatedId = createId('menu-trigger');

    /**
     * In a menubar: the trigger is an item of the menubar's navigation.
     */
    private menubarItem: ListRegistryItem | null = null;

    private readonly menubarIndex = new Store({ index: -1 });

    protected override createParts() {
        const menubar = this.rootElement.menubarElement?.machine;
        this.trigger = new MenuTriggerMachine(this.root.store, this.getOptions(), {
            parent: this.root.store.select('parent'),
            keyboardEventRelay: menubar?.composite.relayKeyboardEvent
        });
        if (menubar) {
            this.menubarItem = new ListRegistryItem(menubar.composite.registry, {
                onIndexChange: (index) => this.menubarIndex.set('index', index)
            });
        }
    }

    protected override applyOptions() {
        this.trigger.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.trigger.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.trigger.connect();
        const disconnectItem = this.menubarItem?.connect();
        return () => {
            disconnectItem?.();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.trigger?.setElement(element);
        this.menubarItem?.setElement(element);
    }

    protected override getProps(): Props {
        const menubar = this.rootElement.menubarElement?.machine;
        const compositeProps = menubar ? menubar.composite.getItemProps(this.menubarIndex.state.index) : {};
        // The composite props go through the trigger's, like the user props of the headless component.
        return mergeProps(this.trigger.getTriggerProps(compositeProps), MenuTriggerMachine.attrs(this.trigger.getState()));
    }

    private getOptions() {
        return {
            // An id written by the page is kept; otherwise the generated one is used.
            id: this.targetId(this.generatedId),
            disabled: this.disabled ?? false,
            nativeButton: this.target?.localName === 'button',
            openOnHover: this.openOnHover,
            delay: this.delay ?? 100,
            closeDelay: this.closeDelay ?? 0
        };
    }
}
