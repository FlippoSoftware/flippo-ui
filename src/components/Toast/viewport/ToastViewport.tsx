'use client';
import * as React from 'react';

import { useLatestRef } from '@flippo-ui/hooks';

import { FocusGuard } from '@lib/FocusGuard';
import { useRenderElement } from '@lib/hooks';
import { ownerDocument, ownerWindow } from '@lib/owner';
import { visuallyHidden } from '@lib/visuallyHidden';
import { activeElement, contains, getTarget } from '@packages/floating-ui-react/utils';

import type { HeadlessUIComponentProps, HTMLProps } from '@lib/types';

import { useToastContext } from '../provider/ToastProviderContext';
import { isFocusVisible } from '../utils/focusVisible';

import { ToastViewportContext } from './ToastViewportContext';
import { ToastViewportCssVars } from './ToastViewportCssVars';

/**
 * A container viewport for toasts.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Toast](https://base-ui.com/react/components/toast)
 */
export function ToastViewport(componentProps: ToastViewport.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        ref,
        ...elementProps
    } = componentProps;

    const {
        toasts,
        pauseTimers,
        resumeTimers,
        setHovering,
        setFocused,
        viewportRef,
        windowFocusedRef,
        prevFocusElement,
        setPrevFocusElement,
        hovering,
        focused,
        hasDifferingHeights
    } = useToastContext();

    const handlingFocusGuardRef = React.useRef(false);
    const focusedRef = useLatestRef(focused);
    const hoveringRef = useLatestRef(hovering);
    const numToasts = toasts.length;
    const frontmostHeight = toasts[0]?.height ?? 0;
    const markedReadyForMouseLeave = React.useRef(false);

    const hasTransitioningToasts = React.useMemo(
        () => toasts.some((toast) => toast.transitionStatus === 'ending'),
        [toasts]
    );

    // Listen globally for F6 so we can force-focus the viewport.
    React.useEffect(() => {
        if (!viewportRef.current) {
            return undefined;
        }

        function handleGlobalKeyDown(event: KeyboardEvent) {
            if (numToasts === 0) {
                return;
            }

            if (event.key === 'F6' && event.target !== viewportRef.current) {
                event.preventDefault();
                setPrevFocusElement(
                    activeElement(ownerDocument(viewportRef.current)) as HTMLElement | null
                );
                viewportRef.current?.focus();
                pauseTimers();
                setFocused(true);
            }
        }

        const win = ownerWindow(viewportRef.current);

        win.addEventListener('keydown', handleGlobalKeyDown);

        return () => {
            win.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [
        pauseTimers,
        setFocused,
        setPrevFocusElement,
        numToasts,
        viewportRef
    ]);

    React.useEffect(() => {
        if (!viewportRef.current || !numToasts) {
            return undefined;
        }

        const win = ownerWindow(viewportRef.current);

        function handleWindowBlur(event: FocusEvent) {
            if (event.target !== win) {
                return;
            }

            windowFocusedRef.current = false;
            pauseTimers();
        }

        function handleWindowFocus(event: FocusEvent) {
            if (event.relatedTarget || event.target === win) {
                return;
            }

            const target = getTarget(event);
            const activeEl = activeElement(ownerDocument(viewportRef.current));
            if (
                !contains(viewportRef.current, target as HTMLElement | null)
                || !isFocusVisible(activeEl)
            ) {
                resumeTimers();
            }

            // Wait for the `handleFocus` event to fire.
            setTimeout(() => {
                windowFocusedRef.current = true;
            });
        }

        win.addEventListener('blur', handleWindowBlur, true);
        win.addEventListener('focus', handleWindowFocus, true);

        return () => {
            win.removeEventListener('blur', handleWindowBlur, true);
            win.removeEventListener('focus', handleWindowFocus, true);
        };
    }, [
        pauseTimers,
        resumeTimers,
        viewportRef,
        windowFocusedRef,
        setFocused,
        focusedRef,
        // `viewportRef.current` isn't available on the first render,
        // since the portal node hasn't yet been created.
        // By adding this dependency, we ensure the window listeners
        // are added when toasts have been created, once the ref is available.
        numToasts
    ]);

    React.useEffect(() => {
        const viewportNode = viewportRef.current;
        if (!viewportNode || numToasts === 0) {
            return undefined;
        }

        const doc = ownerDocument(viewportNode);

        function handlePointerDown(event: PointerEvent) {
            if (event.pointerType !== 'touch') {
                return;
            }

            const target = getTarget(event) as Element | null;
            if (contains(viewportNode, target)) {
                return;
            }

            resumeTimers();
            setHovering(false);
            setFocused(false);
        }

        doc.addEventListener('pointerdown', handlePointerDown, true);

        return () => {
            doc.removeEventListener('pointerdown', handlePointerDown, true);
        };
    }, [
        focusedRef,
        hoveringRef,
        numToasts,
        resumeTimers,
        setFocused,
        setHovering,
        viewportRef
    ]);

    function handleFocusGuard(event: React.FocusEvent) {
        if (!viewportRef.current) {
            return;
        }

        handlingFocusGuardRef.current = true;

        // If we're coming off the container, move to the first toast
        if (event.relatedTarget === viewportRef.current) {
            toasts[0]?.ref?.current?.focus();
        }
        else {
            prevFocusElement?.focus({ preventScroll: true });
        }
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab' && event.shiftKey && event.target === viewportRef.current) {
            event.preventDefault();
            prevFocusElement?.focus({ preventScroll: true });
            resumeTimers();
        }
    }

    React.useEffect(() => {
        if (!windowFocusedRef.current || hasTransitioningToasts || !markedReadyForMouseLeave.current) {
            return;
        }

        // Once transitions have finished, see if a mouseleave was already triggered
        // but blocked from taking effect. If so, we can now safely resume timers and
        // collapse the viewport.
        resumeTimers();
        setHovering(false);
        markedReadyForMouseLeave.current = false;
    }, [
        hasTransitioningToasts,
        resumeTimers,
        setHovering,
        windowFocusedRef
    ]);

    function handleMouseEnter() {
        pauseTimers();
        setHovering(true);
        markedReadyForMouseLeave.current = false;
    }

    function handleMouseLeave() {
        if (toasts.some((toast) => toast.transitionStatus === 'ending')) {
            // When swiping to dismiss, wait until the transitions have settled
            // to avoid the viewport collapsing while the user is interacting.
            markedReadyForMouseLeave.current = true;
        }
        else {
            resumeTimers();
            setHovering(false);
        }
    }

    function handleFocus() {
        if (handlingFocusGuardRef.current) {
            handlingFocusGuardRef.current = false;
            return;
        }

        if (focused) {
            return;
        }

        // If the window was previously blurred, the focus must be visible to
        // pause the timers, since for pointers it's unexpected that focus is
        // considered inside the viewport at this point.
        const activeEl = activeElement(ownerDocument(viewportRef.current));
        if (!windowFocusedRef.current && !isFocusVisible(activeEl)) {
            return;
        }

        if (isFocusVisible(ownerDocument(viewportRef.current).activeElement)) {
            setFocused(true);
            pauseTimers();
        }
    }

    function handleBlur(event: React.FocusEvent) {
        if (!focused || contains(viewportRef.current, event.relatedTarget as HTMLElement | null)) {
            return;
        }

        setFocused(false);
        resumeTimers();
    }

    const defaultProps: HTMLProps = {
        'tabIndex': -1,
        'role': 'region',
        'aria-live': 'polite',
        'aria-atomic': false,
        'aria-relevant': 'additions text',
        'aria-label': 'Notifications',
        'onMouseEnter': handleMouseEnter,
        'onMouseMove': handleMouseEnter,
        'onMouseLeave': handleMouseLeave,
        'onFocus': handleFocus,
        'onBlur': handleBlur,
        'onKeyDown': handleKeyDown,
        'onClick': handleFocus
    };

    const state: ToastViewport.State = React.useMemo(
        () => ({
            expanded: hovering || focused || hasDifferingHeights
        }),
        [hovering, focused, hasDifferingHeights]
    );

    const element = useRenderElement('div', componentProps, {
        ref: [ref, viewportRef],
        state,
        props: [
            defaultProps,
            {
                style: {
                    [ToastViewportCssVars.frontmostHeight as string]: frontmostHeight
                        ? `${frontmostHeight}px`
                        : undefined
                }
            },
            elementProps,
            {
                children: (
                    <React.Fragment>
                        {numToasts > 0 && prevFocusElement && <FocusGuard onFocus={handleFocusGuard} />}
                        {children}
                        {numToasts > 0 && prevFocusElement && <FocusGuard onFocus={handleFocusGuard} />}
                    </React.Fragment>
                )
            }
        ]
    });

    const contextValue = React.useMemo(() => ({ viewportRef }), [viewportRef]);

    const highPriorityToasts = React.useMemo(
        () => toasts.filter((toast) => toast.priority === 'high'),
        [toasts]
    );

    return (
        <ToastViewportContext value={contextValue}>
            {numToasts > 0 && prevFocusElement && <FocusGuard onFocus={handleFocusGuard} />}
            {element}
            {!focused && highPriorityToasts.length > 0 && (
                <div style={visuallyHidden}>
                    {highPriorityToasts.map((toast) => (
                        <div key={toast.id} role={'alert'} aria-atomic>
                            <div>{toast.title}</div>
                            <div>{toast.description}</div>
                        </div>
                    ))}
                </div>
            )}
        </ToastViewportContext>
    );
}

export namespace ToastViewport {
    export type State = {
        /**
         * Whether toasts are expanded in the viewport.
         */
        expanded: boolean;
    };

    export type Props = HeadlessUIComponentProps<'div', State>;
}
