import type { IconName } from '@flippo-software/component-styles/icons';

import { icon } from './kit';

/** Markup of menu items shared by Menu, ContextMenu and Menubar stories. */
export function menuItem(label: string, options: { icon?: IconName; end?: string; attributes?: string } = {}): string {
    const { end, attributes = '' } = options;
    return `<demo-menu-item ${attributes}>${options.icon ? icon(options.icon) : ''}${label}${end ? `<demo-menu-item-end>${end}</demo-menu-item-end>` : ''}</demo-menu-item>`;
}

export function menuCheckbox(label: string, attributes = ''): string {
    return `<demo-menu-checkbox-item ${attributes}>${label}<demo-menu-item-indicator></demo-menu-item-indicator></demo-menu-checkbox-item>`;
}

export function menuRadio(value: string, label: string): string {
    return `<demo-menu-radio-item value="${value}">${label}<demo-menu-item-indicator></demo-menu-item-indicator></demo-menu-radio-item>`;
}

export const separator = '<demo-menu-separator></demo-menu-separator>';

/** A popup with its positioner around `items`. */
export function menuPopup(items: string, positioner = ''): string {
    return `<demo-menu-positioner ${positioner}><demo-menu-popup>${items}</demo-menu-popup></demo-menu-positioner>`;
}
