import { vi } from 'vitest';

type PopoverApi = { showPopover(): void; hidePopover(): void };

/**
 * happy-dom has no Popover API: stubs `showPopover`/`hidePopover` to see what enters and leaves the top layer.
 *
 * @returns The elements in the top layer, the stubs, and a function that removes them.
 */
export function stubPopoverApi() {
    const topLayer = new Set<Element>();
    const showPopover = vi.fn(function (this: HTMLElement) {
        topLayer.add(this);
    });
    const hidePopover = vi.fn(function (this: HTMLElement) {
        topLayer.delete(this);
    });
    Object.assign(HTMLElement.prototype, { showPopover, hidePopover } satisfies PopoverApi);

    const restore = () => {
        const prototype = HTMLElement.prototype as Partial<PopoverApi>;
        // biome-ignore lint/performance/noDelete: the stubs must not stay on the shared prototype.
        delete prototype.showPopover;
        // biome-ignore lint/performance/noDelete: the stubs must not stay on the shared prototype.
        delete prototype.hidePopover;
    };

    return { topLayer, showPopover, hidePopover, restore };
}
