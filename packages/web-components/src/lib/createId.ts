let counter = 0;

/**
 * A document-unique id for generated `id` attributes (e.g. a panel's, for `aria-controls`).
 */
export function createId(prefix: string): string {
    counter += 1;
    return `flippo-${prefix}-${counter}`;
}
