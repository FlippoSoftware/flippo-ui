import React from 'react';

import { ToastViewportMachine } from '@flippo-software/core-components/toast';
import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { toReactProps, useMachineState, useTracker } from '~@lib/core';
import { FocusGuard } from '~@lib/FocusGuard';
import { useRenderElement } from '~@lib/hooks';
import { visuallyHidden } from '~@lib/visuallyHidden';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useToastContext } from '../provider/ToastProviderContext';

import { ToastViewportContext } from './ToastViewportContext';

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

    const { provider } = useToastContext();

    const [viewport] = React.useState(() => new ToastViewportMachine(provider));
    useIsoLayoutEffect(() => viewport.connect(), [viewport]);

    const track = useTracker();
    const state: ToastViewport.State = useMachineState(viewport);
    const renderGuards = track(() => viewport.shouldRenderFocusGuards());

    const element = useRenderElement('div', componentProps, {
        ref: [ref, viewport.setElement],
        state,
        props: [
            elementProps,
            (props) =>
                track(() =>
                    toReactProps(
                        viewport.getViewportProps({
                            ...props,
                            children: (
                                <React.Fragment>
                                    {renderGuards && <FocusGuard onFocus={viewport.onFocusGuardFocus} />}
                                    {children}
                                    {renderGuards && <FocusGuard onFocus={viewport.onFocusGuardFocus} />}
                                </React.Fragment>
                            )
                        })
                    )
                )
        ]
    });

    const contextValue = React.useMemo(() => ({ viewportRef: provider.viewportRef as React.RefObject<HTMLElement | null> }), [provider]);
    const announcements = track(() => viewport.getHighPriorityAnnouncements());

    return (
        <ToastViewportContext value={contextValue}>
            {renderGuards && <FocusGuard onFocus={viewport.onFocusGuardFocus} />}
            {element}
            {announcements.length > 0 && (
                <div style={visuallyHidden}>
                    {announcements.map((toast) => (
                        <div key={toast.id} role='alert' aria-atomic={true}>
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
