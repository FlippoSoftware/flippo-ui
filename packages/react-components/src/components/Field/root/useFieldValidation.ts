import type React from 'react';

import type { HTMLProps } from '~@lib/types';

/**
 * Validation API of a field (provided by `Field.Root` from the core `FieldRootMachine`).
 */
export type UseFieldValidationReturnValue = {
    getValidationProps: (props?: HTMLProps) => HTMLProps;
    getInputValidationProps: (props?: HTMLProps) => HTMLProps;
    inputRef: React.RefObject<HTMLInputElement | null>;
    commit: (value: unknown, revalidate?: boolean) => Promise<void>;
};
