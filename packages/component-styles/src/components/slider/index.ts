import { sva } from '@lynstack/class-recipe';

/** Slider: `root`, `value`, `control`, `track`, `indicator` and `thumb`. */
export const slider = sva({
    slots: ['root', 'value', 'control', 'track', 'indicator', 'thumb'],
    base: {
        root: 'fl-slider-root',
        value: 'fl-slider-value fl-text-label-default',
        control: 'fl-slider-control',
        track: 'fl-slider-track',
        indicator: 'fl-slider-indicator',
        thumb: 'fl-slider-thumb'
    },
    variants: {}
});
