import React from 'react';

import { PopupViewportController, popupViewportStateAttributesMapping } from '@flippo-software/core-components/popup';
import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

import { toReactProps, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePopoverRootContext } from '../root/PopoverRootContext';

const stateAttributesMapping = popupViewportStateAttributesMapping as StateAttributesMapping<PopoverViewport.State>;

/**
 * A viewport for displaying content transitions.
 * This component is only required if one popup can be opened by multiple triggers, its content change based on the trigger
 * and switching between them is animated.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverViewport(componentProps: PopoverViewport.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        ref,
        ...elementProps
    } = componentProps;
    const { store } = usePopoverRootContext();

    const [viewport] = React.useState(() => new PopupViewportController(store));
    useIsoLayoutEffect(() => viewport.connect(), [viewport]);
    // Captures a clone of the current content after every render (the previous content of the next transition).
    useIsoLayoutEffect(() => viewport.captureContent());

    const track = useTracker();
    const { activationDirection, transitioning } = track(() => viewport.getState());

    const state: PopoverViewport.State = React.useMemo(
        () => ({ activationDirection, transitioning }),
        [activationDirection, transitioning]
    );

    const current = (
        <div {...track(() => toReactProps(viewport.getCurrentContainerProps()))} ref={viewport.setCurrentContainer} key='current'>
            {children}
        </div>
    );

    const childrenToRender = transitioning ? (
        <React.Fragment>
            <div {...track(() => toReactProps(viewport.getPreviousContainerProps()))} ref={viewport.setPreviousContainer} key='previous' />
            {current}
        </React.Fragment>
    ) : (
        current
    );

    return useRenderElement('div', componentProps, {
        state,
        ref,
        props: [elementProps, { children: childrenToRender }],
        customStyleHookMapping: stateAttributesMapping
    });
}

export namespace PopoverViewport {
    export type Props = {
        /**
         * The content to render inside the transition container.
         */
        children?: React.ReactNode;
    } & HeadlessUIComponentProps<'div', State>;

    export type State = {
        activationDirection?: string | undefined;
        /**
         * Whether the content is transitioning between triggers.
         */
        transitioning?: boolean;
    };
}
