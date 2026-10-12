import { button as buttonRecipe } from '@flippo-software/component-styles/button';
import { iconMarkup } from '@flippo-software/component-styles/icons';

import type { IconName } from '@flippo-software/component-styles/icons';

/**
 * Layout of the gallery stories (see `.storybook/preview.css`), as HTML strings: a page of sections, each with a
 * title, a description and a zone; rows label the states or sizes on the left, as on the Figma component sheets.
 * The strings are source constants of the stories, never user input.
 */
/** Turns the `code` spans of a description into `<code>`, as Storybook does with the docs descriptions. */
function inlineCode(text: string): string {
    return text.replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function section(title: string, description: string, body: string, options: { raised?: boolean } = {}): string {
    return `<section class="sb-section"><div class="sb-section-head"><h3 class="sb-section-title">${title}</h3>${
        description ? `<p class="sb-section-text">${inlineCode(description)}</p>` : ''
    }</div><div class="sb-zone${options.raised ? ' sb-zone--raised' : ''}">${body}</div></section>`;
}

export function row(label: string, items: string, options: { column?: boolean; fill?: boolean } = {}): string {
    const modifiers = `${options.column ? ' sb-items--column' : ''}${options.fill ? ' sb-items--fill' : ''}`;
    return `<div class="sb-row"><span class="sb-row-label">${label}</span><div class="sb-items${modifiers}">${items}</div></div>`;
}

export function grid(items: string, min?: number): string {
    return `<div class="sb-grid"${min ? ` style="--sb-min: ${min}px"` : ''}>${items}</div>`;
}

export function card(body: string, caption?: string): string {
    return `<div class="sb-card">${caption ? `<span class="sb-caption">${caption}</span>` : ''}${body}</div>`;
}

/** A gallery story: the page of sections, then `setup` for what markup cannot express (properties, renderers). */
export function page(html: string, setup?: (root: HTMLElement) => void): HTMLElement {
    const root = document.createElement('div');
    root.className = 'sb-page';
    root.innerHTML = html;
    setup?.(root);
    return root;
}

/** The SVG of a Flippo icon, as markup. */
export function icon(name: IconName): string {
    return iconMarkup(name);
}

/** A styled button over a native `<button>` (`as-child`); `attributes` go on the styled element. */
export function button(content: string, attributes = ''): string {
    return `<demo-button ${attributes} as-child><button type="button">${content}</button></demo-button>`;
}

/**
 * A native `<button>` with the classes of a styled button, for the triggers of other families (a menu, a dialog):
 * the trigger is the `as-child` target, so the button classes go on the same element.
 */
export function triggerButton(content: string, options: Parameters<typeof buttonRecipe>[0] = {}, attributes = ''): string {
    return `<button type="button" class="${buttonRecipe(options)}" ${attributes}>${content}</button>`;
}

/** A container the reader resizes by its corner, to see how a layout adapts to the width. */
export function resizable(html: string): string {
    return `<div class="sb-resizable">${html}</div>`;
}

/** A section whose zone holds a {@link resizable} container: for layout stories. */
export function resizableSection(title: string, description: string, body: string): string {
    return section(title, description, resizable(body));
}
