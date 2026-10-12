import {
    NavigationMenuContentMachine,
    NavigationMenuPopup,
    NavigationMenuPositionerMachine
} from '@flippo-software/core-components/navigation-menu';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { CompositeRootMachine } from '@flippo-software/core-components/composite';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { prepareTopLayer, releaseTopLayer, showInTopLayer } from '../../../lib/topLayer';
import { NavigationMenuCompositeContext, NavigationMenuItemPart } from '../root/NavigationMenuRootContext';

/**
 * The content of an item, shown in the top layer next to its trigger while the item is open. Place it after the
 * trigger, so that Tab moves into it.
 *
 * State attributes: `data-open`/`data-closed`, `data-activation-direction`, `data-side`, `data-align`, transition
 * attributes.
 */
export class NavigationMenuContentElement extends NavigationMenuItemPart.withAttributes({}) {
    private content!: NavigationMenuContentMachine;

    constructor() {
        super();
        declareProvider(this, NavigationMenuCompositeContext);
    }

    get composite(): CompositeRootMachine | null {
        return this.content?.composite ?? null;
    }

    protected override createParts() {
        const direction = this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
        this.content = new NavigationMenuContentMachine(this.root, this.itemValue, direction);
    }

    protected override applyOptions() {}

    protected override connectParts() {
        const disconnect = this.content.connect();
        const stopProviding = provideContext(this, NavigationMenuCompositeContext, this);
        // While mounted, the content is the positioned popup of the menu.
        const stopShowing = effect(() => {
            const { mounted } = this.content.transitions.state;
            untracked(() => this.sync(mounted));
        });
        return () => {
            stopShowing();
            this.sync(false);
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        if (element) {
            prepareTopLayer(element);
            if (this.content) {
                this.sync(this.content.transitions.state.mounted);
            }
        }
    }

    protected override onTargetRelease(element: HTMLElement) {
        showInTopLayer(element, false);
        releaseTopLayer(element);
    }

    protected override getProps(): Props {
        const { root, content } = this;
        const { positionerElement } = root.store.state;
        const positioned = positionerElement !== null && positionerElement === this.target;
        const positioner = this.rootElement.positioner;
        return mergeProps(
            content.getContentProps(),
            positioned ? positioner.getPositionerProps() : { hidden: !content.transitions.state.mounted },
            NavigationMenuContentMachine.attrs(content.getState()),
            positioned ? NavigationMenuPositionerMachine.attrs(positioner.getState()) : {}
        );
    }

    private sync(mounted: boolean) {
        const element = this.target;
        const { root, content } = this;
        const positioner = this.rootElement.positioner;
        if (mounted && element) {
            content.setElement(element);
            positioner.setElement(element);
            NavigationMenuPopup.setElement(root, element);
            showInTopLayer(element, true);
        } else {
            content.setElement(null);
            if (element && root.store.state.positionerElement === element) {
                positioner.setElement(null);
                NavigationMenuPopup.setElement(root, null);
            }
            if (element) {
                showInTopLayer(element, false);
            }
        }
    }
}
