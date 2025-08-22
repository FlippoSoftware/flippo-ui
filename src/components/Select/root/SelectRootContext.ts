import React from 'react';

import type { Timeout } from '@flippo_ui/hooks';

import type { HTMLProps } from '@lib/types';
import type { FloatingRootContext, useFloatingRootContext } from '@packages/floating-ui-react';

import type { SelectStore } from '../store';

import type { SelectRoot } from './SelectRoot';

export type TSelectRootContext = {
    store: SelectStore;
    name: string | undefined;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    multiple: boolean;
    setValue: (nextValue: any, event?: Event) => void;
    setOpen: (
        open: boolean,
        event: Event | undefined,
        reason: SelectRoot.OpenChangeReason | undefined,
    ) => void;
    listRef: React.RefObject<Array<HTMLElement | null>>;
    popupRef: React.RefObject<HTMLDivElement | null>;
    getItemProps: (
        props?: HTMLProps & { active?: boolean; selected?: boolean },
    ) => Record<string, unknown>; // PREVENT_COMMIT
    events: ReturnType<typeof useFloatingRootContext>['events'];
    valueRef: React.RefObject<HTMLSpanElement | null>;
    valuesRef: React.RefObject<Array<any>>;
    labelsRef: React.RefObject<Array<string | null>>;
    typingRef: React.RefObject<boolean>;
    selectionRef: React.RefObject<{
        allowUnselectedMouseUp: boolean;
        allowSelectedMouseUp: boolean;
        allowSelect: boolean;
    }>;
    selectedItemTextRef: React.RefObject<HTMLSpanElement | null>;
    /**
     * Called by each <Select.Item> when it knows its stable list index.
     * Allows the root to map option values to their DOM positions.
     */
    registerItemIndex: (index: number) => void;
    onOpenChangeComplete?: (open: boolean) => void;
    keyboardActiveRef: React.MutableRefObject<boolean>;
    alignItemWithTriggerActiveRef: React.RefObject<boolean>;
    highlightTimeout: Timeout;
};

export const SelectRootContext = React.createContext<TSelectRootContext | null>(null);
export const SelectFloatingContext = React.createContext<FloatingRootContext | null>(null);

export function useSelectRootContext() {
    const context = React.use(SelectRootContext);
    if (context === null) {
        throw new Error(
            'Base UI: SelectRootContext is missing. Select parts must be placed within <Select.Root>.'
        );
    }
    return context;
}

export function useSelectFloatingContext() {
    const context = React.use(SelectFloatingContext);

    if (context === null) {
        throw new Error(
            'Headless UI: SelectFloatingContext is missing. Select parts must be placed within <Select.Root>.'
        );
    }
    return context;
}
