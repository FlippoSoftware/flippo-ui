import React from 'react';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { useTriggerRegistration } from '~@lib/popups';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';
import {
    safePolygon,
    useClick,
    useHoverReferenceInteraction,
    useInteractions
} from '~@packages/floating-ui-react';

import type { HeadlessUIComponentProps, NonNativeButtonProps } from '~@lib/types';

import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { useMenuItem } from '../item/useMenuItem';
import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';
import { useMenuSubmenuRootContext } from '../submenu-root/MenuSubmenuRootContext';

/**
 * A menu item that opens a submenu.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuSubmenuTrigger(componentProps: MenuSubmenuTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        label,
        id: idProp,
        nativeButton = false,
        openOnHover = true,
        delay = 100,
        closeDelay = 0,
        disabled: disabledProp = false,
        ref,
        ...elementProps
    } = componentProps;

    const listItem = useCompositeListItem();
    const menuPositionerContext = useMenuPositionerContext();

    const { store } = useMenuRootContext();

    const thisTriggerId = useHeadlessUiId(idProp);
    const open = store.useState('open');
    const floatingRootContext = store.useState('floatingRootContext');
    const floatingTreeRoot = store.useState('floatingTreeRoot');

    const baseRegisterTrigger = useTriggerRegistration(thisTriggerId, store);
    const registerTrigger = React.useCallback(
        (element: HTMLElement | null) => {
            const cleanup = baseRegisterTrigger(element);

            if (element !== null && store.select('open') && store.select('activeTriggerId') == null) {
                store.update({
                    activeTriggerId: thisTriggerId,
                    activeTriggerElement: element,
                    closeDelay
                });
            }

            return cleanup;
        },
        [baseRegisterTrigger, closeDelay, store, thisTriggerId]
    );

    const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);

    const submenuRootContext = useMenuSubmenuRootContext();
    if (!submenuRootContext?.parentMenu) {
        throw new Error('Base UI: <Menu.SubmenuTrigger> must be placed in <Menu.SubmenuRoot>.');
    }

    store.useSyncedValues({
        closeDelay,
        activeTriggerElement: triggerElement
    });

    const parentMenuStore = submenuRootContext.parentMenu;

    const itemProps = parentMenuStore.useState('itemProps');
    const highlighted = parentMenuStore.useState('isActive', listItem.index);

    const itemMetadata = React.useMemo(
        () => ({
            type: 'submenu-trigger' as const,
            setActive: () => parentMenuStore.set('activeIndex', listItem.index)
        }),
        [parentMenuStore, listItem.index]
    );

    const rootDisabled = store.useState('disabled');
    const disabled = disabledProp || rootDisabled;

    const { getItemProps, itemRef } = useMenuItem({
        closeOnClick: false,
        disabled,
        highlighted,
        id: thisTriggerId,
        store,
        nativeButton,
        itemMetadata,
        nodeId: menuPositionerContext?.nodeId
    });

    const hoverEnabled = store.useState('hoverEnabled');
    const allowMouseEnter = store.useState('allowMouseEnter');

    const hoverProps = useHoverReferenceInteraction(floatingRootContext, {
        enabled: hoverEnabled && openOnHover && !disabled,
        handleClose: safePolygon({ blockPointerEvents: true }),
        mouseOnly: true,
        move: true,
        restMs: allowMouseEnter ? delay : undefined,
        delay: { open: allowMouseEnter ? delay : 10 ** 10, close: closeDelay },
        triggerElement,
        externalTree: floatingTreeRoot
    });

    const click = useClick(floatingRootContext, {
        enabled: !disabled,
        event: 'mousedown',
        toggle: !openOnHover,
        ignoreMouse: openOnHover,
        stickIfOpen: false
    });

    const localInteractionProps = useInteractions([click]);

    const rootTriggerProps = store.useState('triggerProps', true);
    delete rootTriggerProps.id;

    const state: MenuSubmenuTrigger.State = React.useMemo(
        () => ({ disabled, highlighted, open }),
        [disabled, highlighted, open]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        customStyleHookMapping: triggerOpenStateMapping,
        props: [
            localInteractionProps.getReferenceProps(),
            hoverProps,
            rootTriggerProps,
            itemProps,
            {
                tabIndex: open || highlighted ? 0 : -1,
                onBlur() {
                    if (highlighted) {
                        parentMenuStore.set('activeIndex', null);
                    }
                }
            },
            elementProps,
            getItemProps
        ],
        ref: [
            ref,
            listItem.ref,
            itemRef,
            registerTrigger,
            setTriggerElement
        ]
    });

    return element;
}

export type MenuSubmenuTriggerProps = {
    onClick?: React.MouseEventHandler<HTMLElement>;
    /**
     * Overrides the text label to use when the item is matched during keyboard text navigation.
     */
    label?: string;
    /**
     * @ignore
     */
    id?: string;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
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
} & NonNativeButtonProps & HeadlessUIComponentProps<'div', MenuSubmenuTrigger.State>;

export type MenuSubmenuTriggerState = {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the item is highlighted.
     */
    highlighted: boolean;
    /**
     * Whether the menu is currently open.
     */
    open: boolean;
};

export namespace MenuSubmenuTrigger {
    export type Props = MenuSubmenuTriggerProps;
    export type State = MenuSubmenuTriggerState;
}
