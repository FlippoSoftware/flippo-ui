import React from 'react';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useCompositeListContext } from '../../Composite/list/CompositeListContext';
import { usePinInputRootContext } from '../root/PinInputRootContext';
import { focusElement, getFocusTarget } from '../utils/focusUtils';
import { pinInputStyleHookMapping } from '../utils/styleHooks';

import type { PinInputRoot } from '../root/PinInputRoot';

import { PinInputFocusFunnelContext } from './PinInputFocusFunnelContext';

export function PinInputFocusFunnel(componentProps: PinInputFocusFunnel.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        focusMode = 'first-empty',
        ...elementProps
    } = componentProps;

    const {
        state,
        values,
        focusedInputIndex,
        lastFocusedInputIndex,
        setFocused,
        setFocusedInputIndex
    } = usePinInputRootContext();

    const { elementsRef } = useCompositeListContext();

    /**
     * Get the target input index based on focus mode
     */
    const getTargetInputIndex = React.useCallback(() => {
        const maxIndex = Math.max(0, (elementsRef.current?.length ?? 1) - 1);

        return getFocusTarget(
            focusMode,
            values,
            lastFocusedInputIndex,
            maxIndex
        );
    }, [
        focusMode,
        values,
        lastFocusedInputIndex,
        elementsRef
    ]);

    /**
     * Handle focus funnel click to direct focus to appropriate input
     */
    const onContainerClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        if (focusMode !== 'first-empty' && (event.target as HTMLElement)?.tagName === 'INPUT') {
            return;
        }

        const targetIndex = getTargetInputIndex();

        // Focus the target input through elementsRef
        const targetElement = elementsRef.current?.[targetIndex] ?? null;
        if (focusElement(targetElement)) {
            setFocused(true);
            setFocusedInputIndex(targetIndex);
        }
    }, [
        focusMode,
        getTargetInputIndex,
        elementsRef,
        setFocused,
        setFocusedInputIndex
    ]);

    /**
     * Handle focus funnel focus to ensure proper input focus
     */
    const onContainerFocus = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        // Only handle if focus funnel itself received focus (not from child inputs)
        if (!event.currentTarget.contains(event.relatedTarget)) {
            const targetIndex = getTargetInputIndex();

            const targetElement = elementsRef.current?.[targetIndex] ?? null;
            focusElement(targetElement);
        }
    }, [getTargetInputIndex, elementsRef]);

    /**
     * Handle keyboard shortcuts for focus funnel
     */
    const onContainerKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        // Only handle if the focus funnel itself has focus, not its children
        if (event.target !== event.currentTarget) {
            return;
        }

        const targetIndex = focusedInputIndex ?? getTargetInputIndex();
        const targetElement = elementsRef.current?.[targetIndex] ?? null;

        switch (event.key) {
            case 'Enter':
            case ' ': // Space
                event.preventDefault();
                if (focusElement(targetElement)) {
                    setFocused(true);
                    setFocusedInputIndex(targetIndex);
                }
                break;

            case 'Escape':
                // Clear focus from focus funnel
                (event.currentTarget as HTMLElement).blur();
                break;

            default:
                // For any other key, try to focus the target input and pass the key
                if (targetElement && event.key.length === 1) {
                    event.preventDefault();

                    if (focusElement(targetElement)) {
                        // Dispatch the key event to the input
                        const keyEvent = new KeyboardEvent('keydown', {
                            key: event.key,
                            code: event.code,
                            bubbles: true,
                            cancelable: true
                        });
                        targetElement.dispatchEvent(keyEvent);
                    }
                }
                break;
        }
    }, [
        focusedInputIndex,
        getTargetInputIndex,
        elementsRef,
        setFocused,
        setFocusedInputIndex
    ]);

    const context = React.useMemo(() => ({ focusMode }), [focusMode]);

    const element = useRenderElement(
        'div',
        componentProps,
        {
            ref,
            state,
            props: [{
                'role': 'application',
                'aria-label': 'PIN input focus funnel',
                'aria-describedby': state.valid === false ? 'pin-focus-funnel-error' : undefined,
                'tabIndex': -1, // Make focus funnel focusable but not in tab order
                'onClick': onContainerClick,
                'onFocus': onContainerFocus,
                'onKeyDown': onContainerKeyDown,
                'style': {
                    outline: 'none' // Remove default focus outline since inputs will be focused
                }
            }, elementProps],
            customStyleHookMapping: pinInputStyleHookMapping
        }
    );

    return (
        <PinInputFocusFunnelContext value={context}>
            { element}
        </PinInputFocusFunnelContext>
    );
}

export namespace PinInputFocusFunnel {
    export type State = PinInputRoot.State;

    export type FocusMode = 'last-active' | 'first-empty' | 'first';

    export type Props = HeadlessUIComponentProps<'div', State> & {
        /**
         * Focus mode for the focus funnel
         * - 'last-active': Focus on the last active input (default)
         * - 'first-empty': Focus on the first empty input
         * - 'first': Always focus on the first input
         */
        focusMode?: FocusMode;
    };
}
