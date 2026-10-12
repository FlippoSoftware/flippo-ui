import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { NavigationMenuItemContext, NavigationMenuPart } from '../root/NavigationMenuRootContext';

/**
 * An item of the list: a trigger and its content, or a link.
 *
 * Attributes: `value` (an id by default).
 */
export class NavigationMenuItemElement extends NavigationMenuPart.withAttributes({
    value: 'string'
}) {
    private readonly fallbackValue = createId('navigation-menu-item');

    constructor() {
        super();
        declareProvider(this, NavigationMenuItemContext);
    }

    get itemValue(): string {
        return this.value ?? this.fallbackValue;
    }

    protected override createParts() {}

    protected override applyOptions() {}

    protected override connectParts() {
        return provideContext(this, NavigationMenuItemContext, this);
    }

    protected override getProps(): Props {
        return {};
    }
}
