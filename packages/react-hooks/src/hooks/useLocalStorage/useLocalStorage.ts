import { createStorage, readValue } from './createStorage';

import type { UseStorageOptions } from './createStorage';

export function useLocalStorage<T = string>(props: UseStorageOptions<T>) {
    return createStorage<T>('localStorage', 'use-local-storage')(props);
}

export const readLocalStorageValue = readValue('localStorage');
