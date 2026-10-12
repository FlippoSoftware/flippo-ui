import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { DialogBackdropElement } from '../../dialog/backdrop/DialogBackdropElement';
import { drawerOf } from '../root/DrawerRootContext';

/**
 * A backdrop below the drawer; it fades with the drag.
 *
 * State attributes: those of the dialog backdrop, and `data-swipe-direction-*`.
 */
export class DrawerBackdropElement extends DialogBackdropElement {
    protected override getProps(): Props {
        const { drawerStore } = drawerOf(this.rootElement);
        return mergeProps(super.getProps(), drawerStore.state.popupDataAttributes as Props);
    }
}
