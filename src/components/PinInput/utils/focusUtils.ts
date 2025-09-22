/**
 * Focus utilities for PinInput component
 */

/**
 * Find the index of the first empty input
 */
export function getFirstEmptyIndex(values: string[]): number {
    const index = values.findIndex((value) => value === '');
    return index !== -1 ? index : Math.max(values.length - 1, 0);
}

/**
 * Get focus target based on mode and current state
 */
export function getFocusTarget(
    mode: 'last-active' | 'first-empty' | 'first',
    values: string[],
    lasrFocusedIndex: number | null,
    maxIndex: number
): number {
    switch (mode) {
        case 'first-empty':
            return Math.min(getFirstEmptyIndex(values), maxIndex);

        case 'first':
            return 0;

        case 'last-active':
        default:
            return Math.min(lasrFocusedIndex ?? 0, maxIndex);
    }
}

/**
 * Focus element safely with error handling
 */
export function focusElement(
    element: HTMLElement | null,
    options?: {
        preventScroll?: boolean;
        selectText?: boolean;
    }
): boolean {
    if (!element) {
        return false;
    }

    try {
        element.focus({
            preventScroll: options?.preventScroll ?? false
        });

        // Select text if it's an input element and option is enabled
        if (options?.selectText && element instanceof HTMLInputElement) {
            element.select();
        }

        return true;
    }
    catch (error) {
        console.warn('Failed to focus element:', error);
        return false;
    }
}
