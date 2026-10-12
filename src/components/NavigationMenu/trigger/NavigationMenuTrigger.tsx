import React from 'react';

import { NavigationMenuTriggerMachine } from '@flippo-software/core-components/navigation-menu';

import type { Props } from '@flippo-software/core-components/props';

import { ownerVisuallyHidden } from '~@lib/constants';
import { toReactProps, useMachine, useTracker } from '~@lib/core';
import { FocusGuard } from '~@lib/FocusGuard';
import { pressableTriggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { CompositeItem } from '../../Composite/item/CompositeItem';
import { useNavigationMenuItemContext } from '../item/NavigationMenuItemContext';
import { useNavigationMenuDismissContext } from '../list/NavigationMenuDismissContext';
import { useNavigationMenuRoot } from '../root/NavigationMenuRootContext';

/**
 * Opens the navigation menu popup when hovered or clicked, revealing the
 * associated content.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuTrigger(componentProps: NavigationMenuTrigger.Props) {
    const { className, render, disabled = false, nativeButton = true, ref, ...elementProps } = componentProps;

    const root = useNavigationMenuRoot();
    const { value: itemValue } = useNavigationMenuItemContext();
    const list = useNavigationMenuDismissContext();

    const trigger = useMachine((options) => new NavigationMenuTriggerMachine(root, itemValue, options), { disabled, nativeButton });
    const track = useTracker();

    const open = track(() => trigger.isActiveItem);
    const state: NavigationMenuTrigger.State = React.useMemo(() => ({ open }), [open]);

    const getProps = (props: object) =>
        track(() => toReactProps(trigger.getTriggerProps(props, list?.getDismissProps()?.reference as Props | undefined)));

    return (
        <React.Fragment>
            <CompositeItem
                tag='button'
                render={render}
                className={className}
                state={state}
                stateAttributesMapping={pressableTriggerOpenStateMapping}
                refs={[ref, trigger.setElement]}
                props={[elementProps, getProps]}
            />
            {track(() => trigger.shouldRenderFocusGuards()) && (
                <React.Fragment>
                    <FocusGuard ref={trigger.setBeforeOutsideGuard} onFocus={trigger.onBeforeOutsideGuardFocus} />
                    <span {...track(() => toReactProps(trigger.getOwnerProps()))} style={ownerVisuallyHidden} />
                    <FocusGuard ref={trigger.setAfterOutsideGuard} onFocus={trigger.onAfterOutsideGuardFocus} />
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export type NavigationMenuTriggerState = {
    /**
     * If `true`, the popup is open and the item is active.
     */
    open: boolean;
};

export type NavigationMenuTriggerProps = {} & NativeButtonProps & HeadlessUIComponentProps<'button', NavigationMenuTrigger.State>;

export namespace NavigationMenuTrigger {
    export type State = NavigationMenuTriggerState;
    export type Props = NavigationMenuTriggerProps;
}
