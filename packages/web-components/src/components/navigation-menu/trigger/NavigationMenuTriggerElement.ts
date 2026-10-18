import { NavigationMenuTriggerMachine } from '@flippo-software/core-components/navigation-menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { NavigationMenuListElement } from '../list/NavigationMenuListElement';
import { CompositeItem, findCompositeProvider, NavigationMenuItemPart } from '../root/NavigationMenuRootContext';

/**
 * The button that opens the content of its item (on hover, on press, and with the keyboard).
 *
 * Attributes: `disabled`.
 * State attributes: `data-popup-open`, `data-pressed`.
 */
export class NavigationMenuTriggerElement extends NavigationMenuItemPart.withAttributes({
    /**
     * Whether the trigger ignores user interaction.
     * @default false
     */
    disabled: 'boolean'
}) {
    private trigger!: NavigationMenuTriggerMachine;

    private readonly compositeItem = new CompositeItem();

    private list: NavigationMenuListElement | null = null;

    protected override createParts() {
        this.trigger = new NavigationMenuTriggerMachine(this.root, this.itemValue, this.getOptions());
    }

    protected override applyOptions() {
        this.trigger.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.trigger.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.trigger.connect();
        const provider = findCompositeProvider(this);
        this.list = provider instanceof NavigationMenuListElement ? provider : null;
        const detach = this.compositeItem.attach(provider?.composite ?? null);
        return () => {
            detach();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.trigger?.setElement(element);
        this.compositeItem.setElement(element);
    }

    protected override getProps(): Props {
        const dismissProps = this.list?.machine?.getDismissProps()?.reference as Props | undefined;
        return mergeProps(
            this.trigger.getTriggerProps(this.compositeItem.getProps(), dismissProps),
            NavigationMenuTriggerMachine.attrs({ open: this.trigger.isActiveItem })
        );
    }

    private getOptions() {
        return { disabled: this.disabled ?? false, nativeButton: this.target?.localName === 'button' };
    }
}
