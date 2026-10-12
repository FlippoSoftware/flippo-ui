import { getStyleHookProps, triggerOpenStateMapping } from '@flippo-software/core-components/attributes';
import { NavigationMenuParts } from '@flippo-software/core-components/navigation-menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { NavigationMenuItemPart } from '../root/NavigationMenuRootContext';

/**
 * An icon in the trigger (`aria-hidden`).
 *
 * State attributes: `data-popup-open`.
 */
export class NavigationMenuIconElement extends NavigationMenuItemPart.withAttributes({}) {
    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return () => {};
    }

    protected override getProps(): Props {
        const open = this.root.open && this.root.store.state.value === this.itemValue;
        return mergeProps(NavigationMenuParts.getIconProps(), getStyleHookProps({ open }, triggerOpenStateMapping));
    }
}
