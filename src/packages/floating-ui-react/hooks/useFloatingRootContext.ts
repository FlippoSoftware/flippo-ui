import React from 'react';

import { useEventCallback, useId } from '@flippo-ui/hooks';
import { isElement } from '@floating-ui/utils/dom';

import type { HeadlessUIChangeEventDetails } from '@lib/createHeadlessUIEventDetails';
import type { FloatingUIOpenChangeDetails } from '@lib/types';

import { useFloatingParentNodeId } from '../components/FloatingTree';
import { createEventEmitter } from '../utils/createEventEmitter';

import type {
    ContextData,
    FloatingRootContext,
    ReferenceElement
} from '../types';

export type UseFloatingRootContextOptions = {
    open?: boolean;
    onOpenChange?: (open: boolean, eventDetails: HeadlessUIChangeEventDetails<string>) => void;
    elements: {
        reference: Element | null;
        floating: HTMLElement | null;
    };
    /**
     * Whether to prevent the auto-emitted `openchange` event.
     */
    noEmit?: boolean;
};

export function useFloatingRootContext(
    options: UseFloatingRootContextOptions
): FloatingRootContext {
    const { open = false, onOpenChange: onOpenChangeProp, elements: elementsProp } = options;

    const floatingId = useId();
    const dataRef = React.useRef<ContextData>({});
    const [events] = React.useState(() => createEventEmitter());
    const nested = useFloatingParentNodeId() != null;

    if (process.env.NODE_ENV !== 'production') {
        const optionDomReference = elementsProp.reference;
        if (optionDomReference && !isElement(optionDomReference)) {
            console.error(
                'Cannot pass a virtual element to the `elements.reference` option,',
                'as it must be a real DOM element. Use `refs.setPositionReference()`',
                'instead.'
            );
        }
    }

    const [positionReference, setPositionReference] = React.useState<ReferenceElement | null>(
        elementsProp.reference
    );

    const onOpenChange = useEventCallback(
        (newOpen: boolean, eventDetails: HeadlessUIChangeEventDetails<string>) => {
            dataRef.current.openEvent = newOpen ? eventDetails.event : undefined;
            if (!options.noEmit) {
                const details: FloatingUIOpenChangeDetails = {
                    open: newOpen,
                    reason: eventDetails.reason,
                    nativeEvent: eventDetails.event,
                    nested
                };
                events.emit('openchange', details);
            }
            onOpenChangeProp?.(newOpen, eventDetails);
        }
    );

    const refs = React.useMemo(
        () => ({
            setPositionReference
        }),
        []
    );

    const elements = React.useMemo(
        () => ({
            reference: positionReference || elementsProp.reference || null,
            floating: elementsProp.floating || null,
            domReference: elementsProp.reference as Element | null
        }),
        [positionReference, elementsProp.reference, elementsProp.floating]
    );

    return React.useMemo<FloatingRootContext>(
        () => ({
            dataRef,
            open,
            onOpenChange,
            elements,
            events,
            floatingId,
            refs
        }),
        [
            open,
            onOpenChange,
            elements,
            events,
            floatingId,
            refs
        ]
    );
}

export function getEmptyContext(): FloatingRootContext {
    return {
        open: false,
        onOpenChange: () => {},
        dataRef: { current: {} },
        elements: {
            floating: null,
            reference: null,
            domReference: null
        },
        events: {
            on: () => {},
            off: () => {},
            emit: () => {}
        },
        floatingId: '',
        refs: {
            setPositionReference: () => {}
        }
    };
}
