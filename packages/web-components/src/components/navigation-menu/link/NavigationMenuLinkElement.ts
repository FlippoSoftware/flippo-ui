import { getNavigationMenuLinkProps } from '@flippo-software/core-components/navigation-menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { CompositeItem, findCompositeProvider, NavigationMenuPart } from '../root/NavigationMenuRootContext';

/**
 * A link of the menu; the arrow keys reach it.
 *
 * Attributes: `active` (the current page: `aria-current="page"`), `close-on-click`.
 * State attributes: `data-active`.
 */
export class NavigationMenuLinkElement extends NavigationMenuPart.withAttributes({
    /**
     * Whether the link is the currently active page.
     * @default false
     */
    active: 'boolean',
    /**
     * Whether to close the navigation menu when the link is clicked.
     * @default false
     */
    'close-on-click': 'boolean'
}) {
    private readonly compositeItem = new CompositeItem();

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return this.compositeItem.attach(findCompositeProvider(this)?.composite ?? null);
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.compositeItem.setElement(element);
    }

    protected override getProps(): Props {
        const active = this.active ?? false;
        return mergeProps(
            getNavigationMenuLinkProps(this.root, { active, closeOnClick: this.closeOnClick ?? false }, this.compositeItem.getProps()),
            active ? { 'data-active': '' } : {}
        );
    }
}
