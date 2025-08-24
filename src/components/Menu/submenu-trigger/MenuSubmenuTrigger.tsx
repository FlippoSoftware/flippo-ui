'use client';
import React from 'react';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';
import { triggerOpenStateMapping } from '@lib/popupStateMapping';
import { useFloatingTree } from '@packages/floating-ui-react';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '@lib/types';

import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { useMenuItem } from '../item/useMenuItem';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';

/**
 * A menu item that opens a submenu.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuSubmenuTrigger(componentProps: MenuSubmenuTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        label,
        id: idProp,
        nativeButton = false,
        ref,
        ...elementProps
    } = componentProps;

    const id = useHeadlessUiId(idProp);

    const {
        triggerProps: rootTriggerProps,
        parent,
        setTriggerElement,
        open,
        typingRef,
        disabled,
        allowMouseUpTriggerRef
    } = useMenuRootContext();
    const menuPositionerContext = useMenuPositionerContext();

    if (parent.type !== 'menu') {
        throw new Error('Headless UI: <Menu.SubmenuTrigger> must be placed in <Menu.SubmenuRoot>.');
    }

    const parentMenuContext = parent.context;

    const { activeIndex, itemProps, setActiveIndex } = parentMenuContext;
    const item = useCompositeListItem({ label });

    const highlighted = activeIndex === item.index;

    const { events: menuEvents } = useFloatingTree()!;

    const itemMetadata = React.useMemo(
        () => ({
            type: 'submenu-trigger' as const,
            setActive: () => setActiveIndex(item.index),
            allowMouseEnterEnabled: parentMenuContext.allowMouseEnter
        }),
        [setActiveIndex, item.index, parentMenuContext.allowMouseEnter]
    );

    const { getItemProps, itemRef } = useMenuItem({
        closeOnClick: false,
        disabled,
        highlighted,
        id,
        menuEvents,
        allowMouseUpTriggerRef,
        typingRef,
        nativeButton,
        itemMetadata,
        nodeId: menuPositionerContext?.floatingContext.nodeId
    });

    const state: MenuSubmenuTrigger.State = React.useMemo(
        () => ({ disabled, highlighted, open }),
        [disabled, highlighted, open]
    );

    return useRenderElement('div', componentProps, {
        state,
        ref: [
            ref,
            item.ref,
            itemRef,
            setTriggerElement
        ],
        customStyleHookMapping: triggerOpenStateMapping,
        props: [
            rootTriggerProps,
            itemProps,
            elementProps,
            getItemProps,
            {
                tabIndex: open || highlighted ? 0 : -1,
                onBlur() {
                    if (highlighted) {
                        setActiveIndex(null);
                    }
                }
            }
        ]
    });
}

export namespace MenuSubmenuTrigger {
    export type Props = {
        children?: React.ReactNode;
        onClick?: React.MouseEventHandler<HTMLElement>;
        /**
         * Overrides the text label to use when the item is matched during keyboard text navigation.
         */
        label?: string;
        /**
         * @ignore
         */
        id?: string;
    } & NonNativeButtonProps & HeadlessUIComponentProps<'div', State>;

    export type State = {
    /**
     * Whether the component should ignore user interaction.
     */
        disabled: boolean;
        highlighted: boolean;
        /**
         * Whether the menu is currently open.
         */
        open: boolean;
    };
}
