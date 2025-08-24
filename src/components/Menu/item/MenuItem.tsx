'use client';

import React from 'react';

import { useMergedRef } from '@flippo_ui/hooks';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';
import { useFloatingTree } from '@packages/floating-ui-react';

import type { HeadlessUIComponentProps, HTMLProps, NonNativeButtonProps } from '@lib/types';
import type { FloatingEvents } from '@packages/floating-ui-react';

import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';

import { REGULAR_ITEM, useMenuItem } from './useMenuItem';

const InnerMenuItem = React.memo(
    (
        componentProps: InnerMenuItemProps
    ) => {
        const {
            /* eslint-disable unused-imports/no-unused-vars */
            className,
            render,
            /* eslint-enable unused-imports/no-unused-vars */
            closeOnClick = true,
            disabled = false,
            highlighted,
            id,
            menuEvents,
            itemProps,
            allowMouseUpTriggerRef,
            typingRef,
            nativeButton,
            nodeId,
            ref,
            ...elementProps
        } = componentProps;

        const { getItemProps, itemRef } = useMenuItem({
            closeOnClick,
            disabled,
            highlighted,
            id,
            menuEvents,
            allowMouseUpTriggerRef,
            typingRef,
            nativeButton,
            nodeId,
            itemMetadata: REGULAR_ITEM
        });

        const state: MenuItem.State = React.useMemo(
            () => ({
                disabled,
                highlighted
            }),
            [disabled, highlighted]
        );

        return useRenderElement('div', componentProps, {
            state,
            ref: [itemRef, ref],
            props: [itemProps, elementProps, getItemProps]
        });
    }
);

/**
 * An individual interactive item in the menu.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuItem(props: MenuItem.Props) {
    const {
        id: idProp,
        label,
        nativeButton = false,
        ref,
        ...other
    } = props;

    const itemRef = React.useRef<HTMLElement>(null);
    const listItem = useCompositeListItem({ label });
    const mergedRef = useMergedRef(ref, listItem.ref, itemRef);

    const {
        itemProps,
        activeIndex,
        allowMouseUpTriggerRef,
        typingRef
    } = useMenuRootContext();
    const menuPositionerContext = useMenuPositionerContext(true);
    const id = useHeadlessUiId(idProp);

    const highlighted = listItem.index === activeIndex;
    const { events: menuEvents } = useFloatingTree()!;

    // This wrapper component is used as a performance optimization.
    // MenuItem reads the context and re-renders the actual MenuItem
    // only when it needs to.

    return (
        <InnerMenuItem
          {...other}
          id={id}
          ref={mergedRef}
          highlighted={highlighted}
          menuEvents={menuEvents}
          itemProps={itemProps}
          allowMouseUpTriggerRef={allowMouseUpTriggerRef}
          typingRef={typingRef}
          nativeButton={nativeButton}
          nodeId={menuPositionerContext?.floatingContext.nodeId}
        />
    );
}

type InnerMenuItemProps = {
    highlighted: boolean;
    itemProps: HTMLProps;
    menuEvents: FloatingEvents;
    allowMouseUpTriggerRef: React.RefObject<boolean>;
    typingRef: React.RefObject<boolean>;
    nativeButton: boolean;
    nodeId: string | undefined;
} & MenuItem.Props;

export namespace MenuItem {
    export type State = {
    /**
     * Whether the item should ignore user interaction.
     */
        disabled: boolean;
        /**
         * Whether the item is highlighted.
         */
        highlighted: boolean;
    };

    export type Props = {
        children?: React.ReactNode;
        /**
         * The click handler for the menu item.
         */
        onClick?: React.MouseEventHandler<HTMLElement>;
        /**
         * Whether the component should ignore user interaction.
         * @default false
         */
        disabled?: boolean;
        /**
         * Overrides the text label to use when the item is matched during keyboard text navigation.
         */
        label?: string;
        /**
         * @ignore
         */
        id?: string;
        /**
         * Whether to close the menu when the item is clicked.
         *
         * @default true
         */
        closeOnClick?: boolean;
    } & NonNativeButtonProps & HeadlessUIComponentProps<'div', State>;
}
