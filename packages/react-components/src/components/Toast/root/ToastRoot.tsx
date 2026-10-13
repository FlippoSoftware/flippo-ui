import React from 'react';

import { ToastRootMachine, toastRootStateAttributesMapping } from '@flippo-software/core-components/toast';

import type { TransitionStatus } from '@flippo-software/react-hooks';

import { toReactProps, useMachine, useMachineState, useStoreState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { CustomStyleHookMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useToastContext } from '../provider/ToastProviderContext';

import type { ToastObject as ToastObjectType } from '../useToastManager';

import { ToastRootContext } from './ToastRootContext';

import type { ToastRootContextValue } from './ToastRootContext';

const customStyleHookMapping = toastRootStateAttributesMapping as CustomStyleHookMapping<ToastRoot.State>;

/**
 * Groups all parts of an individual toast.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Toast](https://base-ui.com/react/components/toast)
 */
export function ToastRoot(componentProps: ToastRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        toast,
        swipeDirection,
        ref,
        ...elementProps
    } = componentProps;

    const { provider } = useToastContext();

    const root = useMachine((options) => new ToastRootMachine(provider, options), { toast, swipeDirection });
    const { titleId, descriptionId, currentSwipeDirection } = useStoreState(root.store);
    const track = useTracker();
    const state: ToastRoot.State = useMachineState(root);

    const contextValue: ToastRootContextValue = React.useMemo(
        () => ({
            toast,
            rootRef: root.rootRef as React.RefObject<HTMLElement | null>,
            titleId,
            setTitleId: root.setTitleId as ToastRootContextValue['setTitleId'],
            descriptionId,
            setDescriptionId: root.setDescriptionId as ToastRootContextValue['setDescriptionId'],
            swipeDirection: currentSwipeDirection
        }),
        [toast, root, titleId, descriptionId, currentSwipeDirection]
    );

    const element = useRenderElement('div', componentProps, {
        ref: [ref, root.setElement],
        state,
        customStyleHookMapping,
        props: [elementProps, (props) => track(() => toReactProps(root.getRootProps(props)))]
    });

    return <ToastRootContext value={contextValue}>{element}</ToastRootContext>;
}

export namespace ToastRoot {
    export type ToastObject<Data extends object = any> = ToastObjectType<Data>;

    export type State = {
        transitionStatus: TransitionStatus;
        /**
         * Whether the toasts in the viewport are expanded.
         */
        expanded: boolean;
        /**
         * Whether the toast was removed due to exceeding the limit.
         */
        limited: boolean;
        /**
         * The type of the toast.
         */
        type: string | undefined;
        /**
         * Whether the toast is being swiped.
         */
        swiping: boolean;
        /**
         * The direction the toast is being swiped.
         */
        swipeDirection: 'up' | 'down' | 'left' | 'right' | undefined;
    };

    export type Props = {
        /**
         * The toast to render.
         */
        toast: ToastObject<any>;
        /**
         * Direction(s) in which the toast can be swiped to dismiss.
         * @default ['down', 'right']
         */
        swipeDirection?: 'up' | 'down' | 'left' | 'right' | ('up' | 'down' | 'left' | 'right')[];
    } & HeadlessUIComponentProps<'div', State>;
}
