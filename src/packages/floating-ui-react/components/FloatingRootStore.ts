import type * as React from 'react';

import { createSelector, ReactStore } from '@flippo-ui/hooks/use-store';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { PopupTriggerMap } from '~@lib/popups';
import type { FloatingUIOpenChangeDetails } from '~@lib/types';

import { createEventEmitter } from '../utils/createEventEmitter';

import type { ContextData, FloatingEvents, ReferenceType } from '../types';

export type FloatingRootState = {
    open: boolean;
    domReferenceElement: Element | null;
    referenceElement: ReferenceType | null;
    floatingElement: HTMLElement | null;
    positionReference: ReferenceType | null;
    /**
     * The ID of the floating element.
     */
    floatingId: string | undefined;
};

export type FloatingRootStoreContext<Reason extends string = string, CustomProperties extends object = {}> = {
    onOpenChange:
    | ((open: boolean, eventDetails: HeadlessUIChangeEventDetails<Reason, CustomProperties>) => void)
    | undefined;
    readonly dataRef: React.RefObject<ContextData>;
    readonly events: FloatingEvents;
    nested: boolean;
    noEmit: boolean;
    readonly triggerElements: PopupTriggerMap;
};

const selectors = {
    open: createSelector((state: FloatingRootState) => state.open),
    domReferenceElement: createSelector((state: FloatingRootState) => state.domReferenceElement),
    referenceElement: createSelector(
        (state: FloatingRootState) => state.positionReference ?? state.referenceElement
    ),
    floatingElement: createSelector((state: FloatingRootState) => state.floatingElement),
    floatingId: createSelector((state: FloatingRootState) => state.floatingId)
};

type FloatingRootStoreOptions<Reason extends string = string, CustomProperties extends object = {}> = {
    open: boolean;
    referenceElement: ReferenceType | null;
    floatingElement: HTMLElement | null;
    triggerElements: PopupTriggerMap;
    floatingId: string | undefined;
    nested: boolean;
    noEmit: boolean;
    onOpenChange:
    | ((open: boolean, eventDetails: HeadlessUIChangeEventDetails<Reason, CustomProperties>) => void)
    | undefined;
};

export class FloatingRootStore<Reason extends string = string, CustomProperties extends object = {}> extends ReactStore<
    Readonly<FloatingRootState>,
    FloatingRootStoreContext<Reason, CustomProperties>,
  typeof selectors
> {
    constructor(options: FloatingRootStoreOptions<Reason, CustomProperties>) {
        const {
            nested,
            noEmit,
            onOpenChange,
            triggerElements,
            ...initialState
        } = options;

        super(
            {
                ...initialState,
                positionReference: initialState.referenceElement,
                domReferenceElement: initialState.referenceElement as Element | null
            },
            {
                onOpenChange,
                dataRef: { current: {} },
                events: createEventEmitter(),
                nested,
                noEmit,
                triggerElements
            },
            selectors
        );
    }

    /**
     * Emits the `openchange` event through the internal event emitter and calls the `onOpenChange` handler with the provided arguments.
     *
     * @param newOpen The new open state.
     * @param eventDetails Details about the event that triggered the open state change.
     */
    setOpen = (newOpen: boolean, eventDetails: HeadlessUIChangeEventDetails<Reason, CustomProperties>) => {
        this.context.dataRef.current.openEvent = newOpen ? eventDetails.event : undefined;
        if (!this.context.noEmit) {
            const details: FloatingUIOpenChangeDetails = {
                open: newOpen,
                reason: eventDetails.reason,
                nativeEvent: eventDetails.event,
                nested: this.context.nested,
                triggerElement: eventDetails.trigger
            };

            this.context.events.emit('openchange', details);
        }

        this.context.onOpenChange?.(newOpen, eventDetails);
    };
}
