import React from 'react';

import { NavigationMenuViewportMachine } from '@flippo-software/core-components/navigation-menu';
import { useIsoLayoutEffect } from '@flippo-software/react-hooks';

import { toReactProps, useTracker } from '~@lib/core';
import { FocusGuard } from '~@lib/FocusGuard';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuPositionerContext } from '../positioner/NavigationMenuPositionerContext';
import { useNavigationMenuRoot } from '../root/NavigationMenuRootContext';

function Guards(props: { viewport: NavigationMenuViewportMachine; children: React.ReactNode }) {
    const { viewport, children } = props;
    const track = useTracker();
    if (!track(() => viewport.shouldRenderGuards())) {
        return children;
    }
    return (
        <React.Fragment>
            <FocusGuard ref={viewport.setBeforeInsideGuard} onFocus={viewport.onBeforeInsideGuardFocus} />
            {children}
            <FocusGuard ref={viewport.setAfterInsideGuard} onFocus={viewport.onAfterInsideGuardFocus} />
        </React.Fragment>
    );
}

/**
 * The clipping viewport of the navigation menu's current content.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */

export function NavigationMenuViewport(componentProps: NavigationMenuViewportProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        children,
        id: idProp,
        ...elementProps
    } = componentProps;

    const root = useNavigationMenuRoot();
    const hasPositioner = Boolean(useNavigationMenuPositionerContext(true));
    const id = useHeadlessUiId(idProp) as string;

    const [viewport] = React.useState(() => new NavigationMenuViewportMachine(root, hasPositioner));
    const track = useTracker();
    useIsoLayoutEffect(() => viewport.connect(), [viewport]);

    const element = useRenderElement('div', componentProps, {
        ref: [ref, viewport.setElement],
        props: [
            elementProps,
            (props) =>
                track(() =>
                    toReactProps(
                        viewport.getViewportProps(id, {
                            ...props,
                            children: hasPositioner ? (
                                children
                            ) : (
                                <Guards viewport={viewport}>
                                    <div ref={viewport.setTargetElement}>{children}</div>
                                </Guards>
                            )
                        })
                    )
                )
        ]
    });

    return hasPositioner ? <Guards viewport={viewport}>{element}</Guards> : element;
}

export type NavigationMenuViewportState = {};

export type NavigationMenuViewportProps = {} & HeadlessUIComponentProps<'div', NavigationMenuViewport.State>;

export namespace NavigationMenuViewport {
    export type State = NavigationMenuViewportState;
    export type Props = NavigationMenuViewportProps;
}
