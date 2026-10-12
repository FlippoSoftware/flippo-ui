import { sva } from '@lynstack/class-recipe';

import { dialog } from '../dialog';

const dialogClasses = dialog();

/**
 * Drawer: `backdrop`, `popup` and the `drag` handle. `title`, `description`, `close` and `actions` are the dialog's
 * classes (import `dialog.css` too).
 */
export const drawer = sva({
    slots: ['backdrop', 'popup', 'drag', 'title', 'description', 'close', 'actions'],
    base: {
        backdrop: 'fl-drawer-backdrop fl-backdrop',
        popup: 'fl-drawer-popup',
        drag: 'fl-drawer-drag',
        title: dialogClasses.title,
        description: dialogClasses.description,
        close: dialogClasses.close,
        actions: dialogClasses.actions
    },
    variants: {}
});
