

import { useId } from '@flippo-ui/hooks';

/**
 * Wraps `useId` and prefixes generated `id`s with `base-ui-`
 * @param {string | undefined} idOverride overrides the generated id when provided
 * @return {string | undefined}
 */
export function useHeadlessUiId(idOverride?: string): string | undefined {
    return useId(idOverride, 'headless-ui');
}
