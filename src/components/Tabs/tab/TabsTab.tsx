import React from 'react';

import { useEventCallback, useIsoLayoutEffect } from '@flippo-ui/hooks';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';
import { ownerDocument } from '~@lib/owner';
import { activeElement, contains } from '~@packages/floating-ui-react/utils';

import type { HeadlessUIComponentProps, NativeButtonProps, Orientation } from '~@lib/types';

import { ACTIVE_COMPOSITE_ITEM } from '../../Composite/constants';
import { useCompositeItem } from '../../Composite/item/useCompositeItem';
import { useButton } from '../../use-button';
import { useTabsListContext } from '../list/TabsListContext';
import { useTabsRootContext } from '../root/TabsRootContext';

/**
 * An individual interactive tab button that toggles the corresponding panel.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Tabs](https://base-ui.com/react/components/tabs)
 */
export function TabsTab(componentProps: TabsTab.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        value: valueProp,
        id: idProp,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const {
        value: selectedTabValue,
        getTabPanelIdByTabValueOrIndex,
        orientation
    } = useTabsRootContext();

    const {
        activateOnFocus,
        highlightedTabIndex,
        onTabActivation,
        setHighlightedTabIndex,
        tabsListRef
    } = useTabsListContext();

    const id = useHeadlessUiId(idProp);

    const tabMetadata = React.useMemo(
        () => ({ disabled, id, value: valueProp }),
        [disabled, id, valueProp]
    );

    const {
        compositeProps,
        compositeRef,
        index
        // hook is used instead of the CompositeItem component
        // because the index is needed for Tab internals
    } = useCompositeItem<TabsTab.Metadata>({ metadata: tabMetadata });

    const tabValue = valueProp ?? index;

    // the `selected` state isn't set on the server (it relies on effects to be calculated),
    // so we fall back to checking the `value` param with the selectedTabValue from the TabsContext
    const selected = React.useMemo(() => {
        if (valueProp === undefined) {
            return index < 0 ? false : index === selectedTabValue;
        }

        return valueProp === selectedTabValue;
    }, [index, selectedTabValue, valueProp]);

    const isNavigatingRef = React.useRef(false);

    // Keep the highlighted item in sync with the currently selected tab
    // when the value prop changes externally (controlled mode)
    useIsoLayoutEffect(() => {
        if (isNavigatingRef.current) {
            isNavigatingRef.current = false;
            return;
        }

        if (!(selected && index > -1 && highlightedTabIndex !== index)) {
            return;
        }

        // If focus is currently within the tabs list, don't override the roving
        // focus highlight. This keeps keyboard navigation relative to the focused
        // item after an external/asynchronous selection change.
        const listElement = tabsListRef.current;
        const activeEl = activeElement(ownerDocument(listElement));
        if (listElement && activeEl && contains(listElement, activeEl)) {
            return;
        }

        setHighlightedTabIndex(index);
    }, [
        selected,
        index,
        highlightedTabIndex,
        setHighlightedTabIndex,
        disabled,
        tabsListRef
    ]);

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton,
        focusableWhenDisabled: true
    });

    const tabPanelId = index > -1 ? getTabPanelIdByTabValueOrIndex(valueProp, index) : undefined;

    const isPressingRef = React.useRef(false);
    const isMainButtonRef = React.useRef(false);

    const onClick = useEventCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        if (selected || disabled) {
            return;
        }

        onTabActivation(
            tabValue,
            createChangeEventDetails('none', event.nativeEvent, { activationDirection: 'none' })
        );
    });

    const onFocus = useEventCallback((event: React.FocusEvent<HTMLButtonElement>) => {
        if (selected) {
            return;
        }

        if (index > -1) {
            setHighlightedTabIndex(index);
        }

        if (disabled) {
            return;
        }

        if (
            (activateOnFocus && !isPressingRef.current) // keyboard or touch focus
            || (isPressingRef.current && isMainButtonRef.current) // mouse focus
        ) {
            onTabActivation(
                tabValue,
                createChangeEventDetails('none', event.nativeEvent, { activationDirection: 'none' })
            );
        }
    });

    const onPointerDown = useEventCallback((event: React.PointerEvent<HTMLButtonElement>) => {
        if (selected || disabled) {
            return;
        }

        isPressingRef.current = true;

        function handlePointerUp() {
            isPressingRef.current = false;
            isMainButtonRef.current = false;
        }

        if (!event.button || event.button === 0) {
            isMainButtonRef.current = true;

            const doc = ownerDocument(event.currentTarget);
            doc.addEventListener('pointerup', handlePointerUp, { once: true });
        }
    });

    const state: TabsTab.State = React.useMemo(
        () => ({
            disabled,
            selected,
            orientation
        }),
        [disabled, selected, orientation]
    );

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, buttonRef, compositeRef],
        props: [
            compositeProps,
            {
                'role': 'tab',
                'aria-controls': tabPanelId,
                'aria-selected': selected,
                id,
                onClick,
                onFocus,
                onPointerDown,
                [ACTIVE_COMPOSITE_ITEM as string]: selected ? '' : undefined,
                onKeyDownCapture() {
                    isNavigatingRef.current = true;
                }
            },
            elementProps,
            getButtonProps
        ]
    });

    return element;
}

export namespace TabsTab {
    export type Value = any | null;

    export type ActivationDirection = 'left' | 'right' | 'up' | 'down' | 'none';

    export type Position = {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };

    export type Size = {
        width: number;
        height: number;
    };

    export type Metadata = {
        disabled: boolean;
        id: string | undefined;
        value: any | undefined;
    };

    export type State = {
        /**
         * Whether the component should ignore user interaction.
         */
        disabled: boolean;
        selected: boolean;
        orientation: Orientation;
    };

    export type Props = {
        /**
         * The value of the Tab.
         * When not specified, the value is the child position index.
         */
        value?: Value;
    } & NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
