import { useMediaQuery } from '../useMediaQuery';

import type { UseMediaQueryOptions } from '../useMediaQuery';

export type UseColorSchemeValue = 'dark' | 'light';

export function useColorScheme(
    initialValue?: UseColorSchemeValue,
    options?: Omit<UseMediaQueryOptions, 'defaultMatches'>
): UseColorSchemeValue {
    const defaultMatches = initialValue === 'dark';

    return useMediaQuery('(prefers-color-scheme: dark)', {
        defaultMatches,
        ...options
    })
        ? 'dark'
        : 'light';
}
