import React from 'react';

import { useOpenChangeComplete } from '@flippo-ui/hooks';
import { DISABLED_TRANSITIONS_STYLE, EMPTY_OBJECT } from '~@lib/constants';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';
import { FloatingFocusManager, useFloatingTree } from '~@packages/floating-ui-react';

import type { Interaction, TransitionStatus } from '@flippo-ui/hooks';
import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { COMPOSITE_KEYS } from '../../Composite/composite';
import { useToolbarRootContext } from '../../Toolbar/root/ToolbarRootContext';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';

import type { MenuRoot } from '../root/MenuRoot';

const customStyleHookMapping: StateAttributesMapping<MenuPopup.State> = {
    ...popupStateMapping,
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
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        finalFocus,
        ref,
        ...elementProps
    } = componentProps;

    const {
        open,
        setOpen,
        popupRef,
        transitionStatus,
        popupProps,
        mounted,
        instantType,
        triggerElement,
        onOpenChangeComplete,
        parent,
        lastOpenChangeReason,
        rootId
    } = useMenuRootContext();
    const { side, align, floatingContext } = useMenuPositionerContext();
    const insideToolbar = useToolbarRootContext(true) != null;

    useOpenChangeComplete({
        open,
        ref: popupRef,
        onComplete() {
            if (open) {
                onOpenChangeComplete?.(true);
            }
        }
    });

    const { events: menuEvents } = useFloatingTree()!;

    React.useEffect(() => {
        function handleClose(event: {
            domEvent: Event | undefined;
            reason: MenuRoot.ChangeEventReason;
        }) {
            setOpen(false, createChangeEventDetails(event.reason, event.domEvent));
        }

        menuEvents.on('close', handleClose);

        return () => {
            menuEvents.off('close', handleClose);
        };
    }, [menuEvents, setOpen]);

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
        ref: [ref, popupRef],
        props: [
            popupProps,
            {
                onKeyDown(event) {
                    if (insideToolbar && COMPOSITE_KEYS.has(event.key)) {
                        event.stopPropagation();
                    }
                }
            },
            transitionStatus === 'starting' ? DISABLED_TRANSITIONS_STYLE : EMPTY_OBJECT,
            elementProps,
            { 'data-rootownerid': rootId } as Record<string, string>
        ],
        customStyleHookMapping
    });

    let returnFocus = parent.type === undefined || parent.type === 'context-menu';
    if (triggerElement || (parent.type === 'menubar' && lastOpenChangeReason !== 'outside-press')) {
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
        >
            {element}
        </FloatingFocusManager>
    );
}

export namespace MenuPopup {
    export type State = {
        transitionStatus: TransitionStatus;
        side: Side;
        align: Align;
        /**
         * Whether the menu is currently open.
         */
        open: boolean;
        nested: boolean;
    };

    export type Props = {
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
    } & HeadlessUIComponentProps<'div', State>;
}
