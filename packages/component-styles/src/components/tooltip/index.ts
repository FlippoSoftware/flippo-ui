import { sva } from '@lynstack/class-recipe';

/** Tooltip (Figma "Tooltip"): `positioner`, `popup` and `arrow`. */
export const tooltip = sva({
    slots: ['positioner', 'popup', 'arrow'],
    base: {
        positioner: 'fl-tooltip-positioner',
        popup: 'fl-tooltip-popup fl-popup fl-text-label-default',
        arrow: 'fl-arrow'
    },
    variants: {}
});
