import { sva } from '@lynstack/class-recipe';

/** Menubar: `root` is the track, `trigger` a menu trigger in it (the menus use `menu()`). */
export const menubar = sva({
    slots: ['root', 'trigger'],
    base: {
        root: 'fl-menubar',
        trigger: 'fl-menubar-trigger fl-interactive fl-focus-ring fl-text-body-minus-stronger'
    },
    variants: {}
});
