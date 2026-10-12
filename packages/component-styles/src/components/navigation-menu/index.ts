import { sva } from '@lynstack/class-recipe';

/**
 * Navigation menu: `root`, `list`, `item`, `trigger` with its `icon`, the floating `positioner` / `popup` /
 * `viewport` (React) or the `content` itself (web components), and `link`s with a `linkDescription`.
 */
export const navigationMenu = sva({
    slots: [
        'root',
        'list',
        'item',
        'trigger',
        'icon',
        'positioner',
        'popup',
        'viewport',
        'content',
        'link',
        'linkDescription',
        'arrow',
        'backdrop'
    ],
    base: {
        root: 'fl-navigation-menu-root',
        list: 'fl-navigation-menu-list',
        item: 'fl-navigation-menu-item',
        trigger: 'fl-navigation-menu-trigger fl-interactive fl-focus-ring fl-text-body-minus-stronger',
        icon: 'fl-navigation-menu-icon fl-icon',
        positioner: 'fl-navigation-menu-positioner',
        popup: 'fl-navigation-menu-popup fl-popup',
        viewport: 'fl-navigation-menu-viewport',
        content: 'fl-navigation-menu-content',
        link: 'fl-navigation-menu-link fl-interactive fl-focus-ring fl-text-body-minus-stronger',
        linkDescription: 'fl-navigation-menu-link-description fl-text-label-weaker',
        arrow: 'fl-arrow',
        backdrop: 'fl-navigation-menu-backdrop fl-backdrop'
    },
    variants: {}
});
