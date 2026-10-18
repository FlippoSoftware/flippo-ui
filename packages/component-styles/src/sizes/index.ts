/**
 * The size grid of the controls, for code that lays itself out next to them: the heights behind `--fl-size-*`
 * (`scss/tokens/_scale.scss`, kept equal by the tests) and the families whose `size` follows the control size of the
 * application (`FlippoProvider size`, `define({ size })`).
 */

/** The control sizes of the grid, smallest first. */
export const CONTROL_SIZES = ['small', 'medium', 'large'] as const;

export type ControlSize = (typeof CONTROL_SIZES)[number];

/** The size of a control when nothing sets one. */
export const DEFAULT_CONTROL_SIZE: ControlSize = 'medium';

/**
 * The height of a row of controls of each size, in pixels: an input, a select or a button is that high; a checkbox,
 * a radio or a switch with its label (`.fl-choice-label`) takes that height, centred, so a row of mixed controls
 * aligned at the top looks centred.
 */
export const CONTROL_HEIGHTS: Readonly<Record<ControlSize, number>> = {
    small: 40,
    medium: 48,
    large: 56
};

/**
 * The families (keys of the default props: `button`, `numberField`) whose `size` is a control size: they take the
 * size of the application unless their own is set. Other families with a `size` (a dialog's width, an avatar, tabs)
 * keep theirs.
 */
export const CONTROL_FAMILIES: ReadonlySet<string> = new Set([
    'autocomplete',
    'button',
    'checkbox',
    'combobox',
    'field',
    'input',
    'numberField',
    'radio',
    'segmentedControl',
    'select',
    'switch',
    'toggle'
]);

export function isControlSize(value: unknown): value is ControlSize {
    return (CONTROL_SIZES as readonly unknown[]).includes(value);
}

/** The height of a row of controls of `size`, in pixels. */
export function controlHeight(size: ControlSize): number {
    return CONTROL_HEIGHTS[size];
}
