import React from 'react';

import { useOpenChangeComplete } from '@flippo-ui/hooks/use-open-change-complete';

import type { Interaction } from '@flippo-ui/hooks/use-enhanced-click-handler';
import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { getDisabledMountTransitionStyles } from '~@lib/getDisabledMountTransitionStyles';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import { transitionStatusMapping } from '~@lib/styleHookMapping';
import { FloatingFocusManager, useHoverFloatingInteraction } from '~@packages/floating-ui-react';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { COMPOSITE_KEYS } from '../../Composite/composite';
import { useToolbarRootContext } from '../../Toolbar/root/ToolbarRootContext';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';

import type { MenuRoot } from '../root/MenuRoot';

const stateAttributesMapping: StateAttributesMapping<MenuPopup.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * A container for the menu items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuPopup(componentProps: MenuPopup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        finalFocus,
        ...elementProps
    } = componentProps;

    const { store } = useMenuRootContext();
    const { side, align } = useMenuPositionerContext();
    const insideToolbar = useToolbarRootContext(true) != null;

    const open = store.useState('open');
    const transitionStatus = store.useState('transitionStatus');
    const popupProps = store.useState('popupProps');
    const mounted = store.useState('mounted');
    const instantType = store.useState('instantType');
    const triggerElement = store.useState('activeTriggerElement');
    const parent = store.useState('parent');
    const lastOpenChangeReason = store.useState('lastOpenChangeReason');
    const rootId = store.useState('rootId');
    const floatingContext = store.useState('floatingRootContext');
    const floatingTreeRoot = store.useState('floatingTreeRoot');
    const closeDelay = store.useState('closeDelay');
    const activeTriggerElement = store.useState('activeTriggerElement');

    useOpenChangeComplete({
        open,
        ref: store.context.popupRef,
        onComplete() {
            if (open) {
                store.context.onOpenChangeComplete?.(true);
            }
        }
    });

    React.useEffect(() => {
        function handleClose(event: {
            domEvent: Event | undefined;
            reason: MenuRoot.ChangeEventReason;
        }) {
            store.setOpen(false, createChangeEventDetails(event.reason, event.domEvent));
        }

        floatingTreeRoot.events.on('close', handleClose);

        return () => {
            floatingTreeRoot.events.off('close', handleClose);
        };
    }, [floatingTreeRoot.events, store]);

    const hoverEnabled = store.useState('hoverEnabled');
    const disabled = store.useState('disabled');

    useHoverFloatingInteraction(floatingContext, {
        enabled:
      hoverEnabled && !disabled && parent.type !== 'context-menu' && parent.type !== 'menubar',
        closeDelay
    });

    const state: MenuPopup.State = React.useMemo(
        () => ({
            transitionStatus,
            side,
            align,
            open,
            nested: parent.type === 'menu',
            instant: instantType
        }),
        [
            transitionStatus,
            side,
            align,
            open,
            parent.type,
            instantType
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, store.context.popupRef],
        customStyleHookMapping: stateAttributesMapping,
        props: [
            popupProps,
            {
                onKeyDown(event) {
                    if (insideToolbar && COMPOSITE_KEYS.has(event.key)) {
                        event.stopPropagation();
                    }
                }
            },
            getDisabledMountTransitionStyles(transitionStatus),
            elementProps,
            { 'data-rootownerid': rootId } as Record<string, string>
        ]
    });

    let returnFocus = parent.type === undefined || parent.type === 'context-menu';
    if (
        triggerElement
        || (parent.type === 'menubar' && lastOpenChangeReason !== REASONS.outsidePress)
    ) {
        returnFocus = true;
    }

    return (
        <FloatingFocusManager
            context={floatingContext}
            modal={false}
            disabled={!mounted}
            returnFocus={finalFocus === undefined ? returnFocus : finalFocus}
            initialFocus={parent.type !== 'menu'}
            restoreFocus
            externalTree={parent.type !== 'menubar' ? floatingTreeRoot : undefined}
            previousFocusableElement={activeTriggerElement as HTMLElement | null}
            nextFocusableElement={
                parent.type === undefined ? store.context.triggerFocusTargetRef : undefined
            }
            beforeContentFocusGuardRef={
                parent.type === undefined ? store.context.beforeContentFocusGuardRef : undefined
            }
        >
            {element}
        </FloatingFocusManager>
    );
}

export type MenuPopupProps = {
    children?: React.ReactNode;
    /**
     * @ignore
     */
    id?: string;
    /**
     * Determines the element to focus when the menu is closed.
     *
     * - `false`: Do not move focus.
     * - `true`: Move focus based on the default behavior (trigger or previously focused element).
     * - `RefObject`: Move focus to the ref element.
     * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
     *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
     */
    finalFocus?:
      | boolean
      | React.RefObject<HTMLElement | null>
      | ((closeType: Interaction) => boolean | HTMLElement | null | void);
} & HeadlessUIComponentProps<'div', MenuPopup.State>;

export type MenuPopupState = {
    transitionStatus: TransitionStatus;
    side: Side;
    align: Align;
    /**
     * Whether the menu is currently open.
     */
    open: boolean;
    nested: boolean;
};

export namespace MenuPopup {
    export type Props = MenuPopupProps;
    export type State = MenuPopupState;
}
