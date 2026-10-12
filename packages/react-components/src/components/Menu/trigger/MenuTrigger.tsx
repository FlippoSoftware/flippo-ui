import React from 'react';

import { MenuTriggerMachine } from '@flippo-software/core-components/menu';

import type { MenuHandle, MenuParent } from '@flippo-software/core-components/menu';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { FocusGuard } from '~@lib/FocusGuard';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { pressableTriggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { CompositeItem } from '../../Composite/item/CompositeItem';
import { useCompositeRootContext } from '../../Composite/root/CompositeRootContext';
import { useMenubarContext } from '../../Menubar/MenubarContext';
import { useMenuRootContext } from '../root/MenuRootContext';

/**
 * A button that opens the menu.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuTrigger(componentProps: MenuTriggerProps) {
    const {
        render,
        className,
        disabled = false,
        nativeButton = true,
        id: idProp,
        openOnHover,
        delay = 100,
        closeDelay = 0,
        handle,
        payload,
        ref,
        ...elementProps
    } = componentProps;

    const rootContext = useMenuRootContext(true);
    const store = handle?.store ?? rootContext?.store;
    if (!store) {
        throw new Error('Base UI: <Menu.Trigger> must be either used within a <Menu.Root> component or provided with a handle.');
    }

    const menubar = useMenubarContext(true);
    const compositeRoot = useCompositeRootContext(true);
    const parent: MenuParent = rootContext?.parent ?? (menubar ? { type: 'menubar', context: menubar.context } : { type: undefined });
    const thisTriggerId = useHeadlessUiId(idProp) as string;

    const trigger = useMachine(
        (options) =>
            new MenuTriggerMachine(store, options, {
                parent,
                keyboardEventRelay: parent.type === 'menubar' ? (compositeRoot?.relayKeyboardEvent as never) : undefined
            }),
        { id: thisTriggerId, disabled, nativeButton, openOnHover, delay, closeDelay, payload }
    );
    const track = useTracker();
    const state: MenuTrigger.State = useMachineState(trigger);

    const getProps = (props: object) => track(() => toReactProps(trigger.getTriggerProps(props)));

    const element = useRenderElement('button', componentProps, {
        enabled: !trigger.isInMenubar,
        customStyleHookMapping: pressableTriggerOpenStateMapping,
        state,
        ref: [ref, trigger.setElement],
        props: [elementProps, getProps]
    });

    if (trigger.isInMenubar) {
        return (
            <CompositeItem
                tag='button'
                render={render}
                className={className}
                state={state}
                refs={[ref, trigger.setElement]}
                props={[elementProps, getProps]}
                stateAttributesMapping={pressableTriggerOpenStateMapping}
            />
        );
    }

    // A fragment with key is required to ensure that the `element` is mounted to the same DOM node
    // regardless of whether the focus guards are rendered or not.
    if (track(() => trigger.shouldRenderFocusGuards())) {
        return (
            <React.Fragment>
                <FocusGuard
                    ref={trigger.setPreFocusGuard}
                    onFocus={trigger.onPreFocusGuardFocus}
                    key={`${thisTriggerId}-pre-focus-guard`}
                />
                <React.Fragment key={thisTriggerId}>{element}</React.Fragment>
                <FocusGuard ref={trigger.setFocusTarget} onFocus={trigger.onFocusTargetFocus} key={`${thisTriggerId}-post-focus-guard`} />
            </React.Fragment>
        );
    }

    return <React.Fragment key={thisTriggerId}>{element}</React.Fragment>;
}

export type MenuTriggerProps<Payload = unknown> = {
    children?: React.ReactNode;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * A handle to associate the trigger with a menu.
     */
    handle?: MenuHandle<Payload>;
    /**
     * A payload to pass to the menu when it is opened.
     */
    payload?: Payload;
    /**
     * How long to wait before the menu may be opened on hover. Specified in milliseconds.
     *
     * Requires the `openOnHover` prop.
     * @default 100
     */
    delay?: number;
    /**
     * How long to wait before closing the menu that was opened on hover.
     * Specified in milliseconds.
     *
     * Requires the `openOnHover` prop.
     * @default 0
     */
    closeDelay?: number;
    /**
     * Whether the menu should also open when the trigger is hovered.
     */
    openOnHover?: boolean;
} & NativeButtonProps &
    HeadlessUIComponentProps<'button', MenuTrigger.State>;

export type MenuTriggerState = {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the menu is currently open.
     */
    open: boolean;
};

export namespace MenuTrigger {
    export type Props<Payload = unknown> = MenuTriggerProps<Payload>;
    export type State = MenuTriggerState;
}
