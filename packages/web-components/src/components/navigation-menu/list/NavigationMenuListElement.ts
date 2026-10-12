import { NavigationMenuListMachine } from '@flippo-software/core-components/navigation-menu';
import { mergeProps } from '@flippo-software/core-components/props';

import type { CompositeRootMachine } from '@flippo-software/core-components/composite';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { NavigationMenuCompositeContext, NavigationMenuListContext, NavigationMenuPart } from '../root/NavigationMenuRootContext';

/**
 * The list of the items; the arrow keys move between their triggers and links.
 *
 * State attributes: `data-open`.
 */
export class NavigationMenuListElement extends NavigationMenuPart.withAttributes({}) {
    private list!: NavigationMenuListMachine;

    constructor() {
        super();
        declareProvider(this, NavigationMenuListContext);
        declareProvider(this, NavigationMenuCompositeContext);
    }

    get machine(): NavigationMenuListMachine {
        return this.list;
    }

    get composite(): CompositeRootMachine | null {
        return this.list?.composite ?? null;
    }

    protected override createParts() {
        this.list = new NavigationMenuListMachine(this.root, this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr');
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.list.connect();
        const stopList = provideContext(this, NavigationMenuListContext, this);
        const stopComposite = provideContext(this, NavigationMenuCompositeContext, this);
        return () => {
            stopComposite();
            stopList();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.list?.composite?.setRoot(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.list.getListProps(), this.root.open ? { 'data-open': '' } : {});
    }
}
