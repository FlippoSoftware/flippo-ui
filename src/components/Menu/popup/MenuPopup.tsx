'use client';

import React from 'react';

import { useOpenChangeComplete } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { DISABLED_TRANSITIONS_STYLE, EMPTY_OBJECT } from '@lib/constants';
import { useRenderElement } from '@lib/hooks';
import { popupStateMapping } from '@lib/popupStateMapping';
import { transitionStatusMapping } from '@lib/styleHookMapping';
import { FloatingFocusManager, useFloatingTree } from '@packages/floating-ui-react';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';
import type { TAlign, TSide } from '@lib/hooks';
import type { HeadlessUIComponentProps } from '@lib/types';

import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';

import type { MenuRoot } from '../root/MenuRoot';

const customStyleHookMapping: CustomStyleHookMapping<MenuPopup.State> = {
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
        onOpenChangeComplete,
        parent,
        lastOpenChangeReason,
        rootId
    } = useMenuRootContext();
    const { side, align, floatingContext } = useMenuPositionerContext();

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
            reason: MenuRoot.OpenChangeReason | undefined;
        }) {
            setOpen(false, event.domEvent, event.reason);
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
        customStyleHookMapping,
        props: [
            popupProps,
            transitionStatus === 'starting' ? DISABLED_TRANSITIONS_STYLE : EMPTY_OBJECT,
            elementProps,
            { 'data-rootownerid': rootId } as Record<string, string>
        ]
    });

    let returnFocus = parent.type === undefined || parent.type === 'context-menu';
    if (parent.type === 'menubar' && lastOpenChangeReason !== 'outside-press') {
        returnFocus = true;
    }

    return (
        <FloatingFocusManager
          context={floatingContext}
          modal={false}
          disabled={!mounted}
          returnFocus={finalFocus || returnFocus}
          initialFocus={parent.type === 'menu' ? -1 : 0}
          restoreFocus
        >
            {element}
        </FloatingFocusManager>
    );
}

export namespace MenuPopup {
    export type State = {
        transitionStatus: TransitionStatus;
        side: TSide;
        align: TAlign;
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
         * By default, focus returns to the trigger.
         */
        finalFocus?: React.RefObject<HTMLElement | null>;
    } & HeadlessUIComponentProps<'div', State>;
}
