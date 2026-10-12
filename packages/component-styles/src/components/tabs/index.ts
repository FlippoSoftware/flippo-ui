import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/**
 * Tabs (Figma "Tabs & Menu"): `line` with the sliding `indicator`, `pill` and `filter` (with an optional `count`).
 * `stacked` puts a filter tab's icon above its label (Figma "Filter Tab", vertical).
 */
export const tabs = sva({
    slots: ['root', 'list', 'tab', 'count', 'indicator', 'panel'],
    base: {
        root: 'fl-tabs-root',
        list: 'fl-tabs-list',
        tab: 'fl-tabs-tab fl-interactive fl-focus-ring',
        count: 'fl-tabs-count fl-text-label-default',
        indicator: 'fl-tabs-indicator',
        panel: 'fl-tabs-panel'
    },
    variants: {
        variant: {
            line: { tab: 'fl-text-body-stronger' },
            pill: { tab: 'fl-tabs-tab--pill fl-text-body-stronger', indicator: 'fl-tabs-indicator--none' },
            filter: { tab: 'fl-tabs-tab--filter fl-text-body-minus-stronger', indicator: 'fl-tabs-indicator--none' }
        },
        size: {
            large: {},
            medium: {}
        },
        stacked: {
            true: { tab: 'fl-tabs-tab--stacked' },
            false: {}
        }
    },
    compoundVariants: [
        {
            variants: { variant: 'pill', size: 'medium' },
            classNames: { tab: 'fl-tabs-tab--medium' }
        }
    ],
    defaultVariants: {
        variant: 'line',
        size: 'large',
        stacked: false
    }
});

export type TabsVariants = VariantsOf<typeof tabs>;
