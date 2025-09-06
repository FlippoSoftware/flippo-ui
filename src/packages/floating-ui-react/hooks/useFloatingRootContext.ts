import React from 'react';

import { useEventCallback, useId } from '@flippo-ui/hooks';
import { isElement } from '@floating-ui/utils/dom';

import { useFloatingParentNodeId } from '../components/FloatingTree';
import { createEventEmitter } from '../utils/createEventEmitter';

import type {
    ContextData,
    FloatingRootContext,
    OpenChangeReason,
    ReferenceType
} from '../types';

export type UseFloatingRootContextOptions = {
    open?: boolean;
    onOpenChange?: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
    elements: {
        reference: Element | null;
        floating: HTMLElement | null;
    };
};

export function useFloatingRootContext<RT extends ReferenceType = ReferenceType>(
    options: UseFloatingRootContextOptions
): FloatingRootContext<RT> {
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

    const [positionReference, setPositionReference] = React.useState<ReferenceType | null>(
        elementsProp.reference
    );

    const onOpenChange = useEventCallback(
        (newOpen: boolean, event?: Event, reason?: OpenChangeReason) => {
            dataRef.current.openEvent = newOpen ? event : undefined;
            events.emit('openchange', {
                open: newOpen,
                event,
                reason,
                nested
            });
            onOpenChangeProp?.(newOpen, event, reason);
        }
    );

    const refs = React.useMemo<FloatingRootContext<RT>['refs']>(
        () => ({
            setPositionReference
        }),
        []
    );

    const elements = React.useMemo<FloatingRootContext<RT>['elements']>(
        () => ({
            reference: (positionReference || elementsProp.reference || null) as RT | null,
            floating: elementsProp.floating || null,
            domReference: elementsProp.reference as Element | null
        }),
        [positionReference, elementsProp.reference, elementsProp.floating]
    );

    return React.useMemo<FloatingRootContext<RT>>(
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
