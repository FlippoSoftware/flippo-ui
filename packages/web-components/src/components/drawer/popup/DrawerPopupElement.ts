import { getDrawerPopupProps } from '@flippo-software/core-components/drawer';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { DialogPopupElement } from '../../dialog/popup/DialogPopupElement';
import { drawerOf } from '../root/DrawerRootContext';

/**
 * The panel of the drawer, shown in the top layer (place it at its edge with CSS). It follows the drag: its
 * position is in CSS variables (`--drawer-drag-offset`…).
 *
 * State attributes: those of the dialog popup, `data-swipe-direction-*`, `data-snap-points`, `data-dragging`.
 */
export class DrawerPopupElement extends DialogPopupElement {
    protected override readonly centered = false;

    protected override getProps(): Props {
        return mergeProps(super.getProps(), getDrawerPopupProps(drawerOf(this.rootElement).drawerStore));
    }
}
