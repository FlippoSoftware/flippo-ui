import React from 'react';

import { useControlledState, useMergedRef } from '@flippo-ui/hooks';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { useFloatingTree } from '~@packages/floating-ui-react';

import type { HeadlessUIComponentProps, HTMLProps, NonNativeButtonProps } from '~@lib/types';
import type { FloatingEvents } from '~@packages/floating-ui-react';

import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { REGULAR_ITEM, useMenuItem } from '../item/useMenuItem';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';
import { itemMapping } from '../utils/styleHookMapping';

import type { MenuRoot } from '../root/MenuRoot';

import { MenuCheckboxItemContext } from './MenuCheckboxItemContext';

const InnerMenuCheckboxItem = React.memo(
    (
        componentProps: InnerMenuCheckboxItemProps
    ) => {
        const {
            /* eslint-disable unused-imports/no-unused-vars */
            className,
            render,
            /* eslint-enable unused-imports/no-unused-vars */
            checked: checkedProp,
            defaultChecked,
            onCheckedChange,
            closeOnClick,
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

        const [checked, setChecked] = useControlledState({
            prop: checkedProp,
            defaultProp: defaultChecked ?? false,
            caller: 'MenuCheckboxItem'
        });

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

        const state: MenuCheckboxItem.State = React.useMemo(
            () => ({
                disabled,
                highlighted,
                checked
            }),
            [disabled, highlighted, checked]
        );

        const element = useRenderElement('div', componentProps, {
            state,
            ref: [itemRef, ref],
            props: [
                itemProps,
                {
                    'role': 'menuitemcheckbox',
                    'aria-checked': checked,
                    onClick(event: React.MouseEvent) {
                        const details = createChangeEventDetails('item-press', event.nativeEvent);

                        onCheckedChange?.(!checked, details);

                        if (details.isCanceled) {
                            return;
                        }

                        setChecked((currentlyChecked) => !currentlyChecked);
                    }
                },
                elementProps,
                getItemProps
            ],
            customStyleHookMapping: itemMapping
        });

        return (
            <MenuCheckboxItemContext value={state}>{element}</MenuCheckboxItemContext>
        );
    }
);

/**
 * A menu item that toggles a setting on or off.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuCheckboxItem(props: MenuCheckboxItem.Props) {
    const {
        id: idProp,
        label,
        closeOnClick = false,
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
    // MenuCheckboxItem reads the context and re-renders the actual MenuCheckboxItem
    // only when it needs to.

    return (
        <InnerMenuCheckboxItem
            {...other}
            id={id}
            ref={mergedRef}
            highlighted={highlighted}
            menuEvents={menuEvents}
            itemProps={itemProps}
            allowMouseUpTriggerRef={allowMouseUpTriggerRef}
            typingRef={typingRef}
            closeOnClick={closeOnClick}
            nativeButton={nativeButton}
            nodeId={menuPositionerContext?.floatingContext.nodeId}
        />
    );
}

type InnerMenuCheckboxItemProps = {
    highlighted: boolean;
    itemProps: HTMLProps;
    menuEvents: FloatingEvents;
    allowMouseUpTriggerRef: React.RefObject<boolean>;
    typingRef: React.RefObject<boolean>;
    closeOnClick: boolean;
    nativeButton: boolean;
    nodeId: string | undefined;
} & MenuCheckboxItem.Props;

export namespace MenuCheckboxItem {
    export type State = {
    /**
     * Whether the checkbox item should ignore user interaction.
     */
        disabled: boolean;
        /**
         * Whether the checkbox item is currently highlighted.
         */
        highlighted: boolean;
        /**
         * Whether the checkbox item is currently ticked.
         */
        checked: boolean;
    };

    export type Props = {
    /**
     * Whether the checkbox item is currently ticked.
     *
     * To render an uncontrolled checkbox item, use the `defaultChecked` prop instead.
     */
        checked?: boolean;
        /**
         * Whether the checkbox item is initially ticked.
         *
         * To render a controlled checkbox item, use the `checked` prop instead.
         * @default false
         */
        defaultChecked?: boolean;
        /**
         * Event handler called when the checkbox item is ticked or unticked.
         */
        onCheckedChange?: (checked: boolean, eventDetails: ChangeEventDetails) => void;
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
         * @default false
         */
        closeOnClick?: boolean;
    } & NonNativeButtonProps & HeadlessUIComponentProps<'div', State>;

    export type ChangeEventReason = MenuRoot.ChangeEventReason;
    export type ChangeEventDetails = MenuRoot.ChangeEventDetails;
}
