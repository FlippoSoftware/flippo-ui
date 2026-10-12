import type { DialogElement } from '../../dialog/root/DialogElement';

import { DrawerElement } from './DrawerElement';

export function drawerOf(element: DialogElement): DrawerElement {
    if (!(element instanceof DrawerElement)) {
        throw new Error('Flippo web components: drawer parts must be placed in a drawer.');
    }
    return element;
}
