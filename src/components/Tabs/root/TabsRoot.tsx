'use client';

import React from 'react';

import { useControlledState, useEventCallback } from '@flippo_ui/hooks';

import { useDirection, useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps, Orientation } from '@lib/types';

import { CompositeList } from '../../Composite/list/CompositeList';

import type { CompositeMetadata } from '../../Composite/list/CompositeList';
import type { TabsPanel } from '../panel/TabsPanel';
import type { TabsTab } from '../tab/TabsTab';

import { tabsStyleHookMapping } from './styleHooks';
import { TabsRootContext } from './TabsRootContext';

import type { TTabsRootContext } from './TabsRootContext';

export function TabsRoot(componentProps: TabsRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        value: valueProp,
        defaultValue = 0,
        orientation = 'horizontal',
        ref,
        onValueChange: onValueChangeProp,
        ...elementProps
    } = componentProps;

    const direction = useDirection();

    const tabPanelRefs = React.useRef<(HTMLElement | null)[]>([]);

    const [value, setValue] = useControlledState({
        prop: valueProp,
        defaultProp: defaultValue,
        caller: 'TabsRoot'
    });

    const [tabPanelMap, setTabPanelMap] = React.useState(
        () => new Map<Node, CompositeMetadata<TabsPanel.Metadata> | null>()
    );
    const [tabMap, setTabMap] = React.useState(
        () => new Map<Node, CompositeMetadata<TabsTab.Metadata> | null>()
    );

    const [tabActivationDirection, setTabActivationDirection]
        = React.useState<TabsTab.ActivationDirection>('none');

    const onValueChange = useEventCallback(
        (
            newValue: TabsTab.Value,
            activationDirection: TabsTab.ActivationDirection,
            event: Event | undefined
        ) => {
            setValue(newValue);
            setTabActivationDirection(activationDirection);
            onValueChangeProp?.(newValue, event);
        }
    );

    const getTabPanelIdByTabValueOrIndex = React.useCallback((
        tabValue: TabsTab.Value | undefined,
        index: number
    ) => {
        if (tabValue === undefined && index < 0)
            return undefined;

        for (const tabPanelMetadata of tabPanelMap.values()) {
            if (tabValue !== undefined && tabPanelMetadata && tabValue === tabPanelMetadata?.value) {
                return tabPanelMetadata.id;
            }

            if (
                tabValue === undefined
                && tabPanelMetadata?.index
                && tabPanelMetadata?.index === index
            ) {
                return tabPanelMetadata.id;
            }
        }

        return undefined;
    }, [tabPanelMap]);

    const getTabIdByPanelValueOrIndex = React.useCallback(
        (tabPanelValue: TabsTab.Value | undefined, index: number) => {
            if (tabPanelValue === undefined && index < 0) {
                return undefined;
            }

            for (const tabMetadata of tabMap.values()) {
                if (
                    tabPanelValue !== undefined
                    && index > -1
                    && tabPanelValue === (tabMetadata?.value ?? tabMetadata?.index ?? undefined)
                ) {
                    return tabMetadata?.id;
                }

                if (
                    tabPanelValue === undefined
                    && index > -1
                    && index === (tabMetadata?.value ?? tabMetadata?.index ?? undefined)
                ) {
                    return tabMetadata?.id;
                }
            }

            return undefined;
        },
        [tabMap]
    );

    const getTabElementBySelectedValue = React.useCallback(
        (selectedValue: TabsTab.Value | undefined): HTMLElement | null => {
            if (selectedValue === undefined) {
                return null;
            }

            for (const [tabElement, tabMetadata] of tabMap.entries()) {
                if (tabMetadata != null && selectedValue === (tabMetadata.value ?? tabMetadata.index)) {
                    return tabElement as HTMLElement;
                }
            }

            return null;
        },
        [tabMap]
    );

    const tabsContextValue: TTabsRootContext = React.useMemo(
        () => ({
            direction,
            getTabElementBySelectedValue,
            getTabIdByPanelValueOrIndex,
            getTabPanelIdByTabValueOrIndex,
            onValueChange,
            orientation,
            setTabMap,
            tabActivationDirection,
            value
        }),
        [
            direction,
            getTabElementBySelectedValue,
            getTabIdByPanelValueOrIndex,
            getTabPanelIdByTabValueOrIndex,
            onValueChange,
            orientation,
            setTabMap,
            tabActivationDirection,
            value
        ]
    );

    const state: TabsRoot.State = React.useMemo(() => ({
        orientation,
        tabActivationDirection
    }), [orientation, tabActivationDirection]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: tabsStyleHookMapping
    });

    return (
        <TabsRootContext value={tabsContextValue}>
            <CompositeList<TabsPanel.Metadata> elementsRef={tabPanelRefs} onMapChange={setTabPanelMap}>
                {element}
            </CompositeList>
        </TabsRootContext>
    );
}

export namespace TabsRoot {
    export type State = {
        orientation: Orientation;
        tabActivationDirection: TabsTab.ActivationDirection;
    };

    export type Props = {
        /**
         * The value of the currently selected `Tab`. Use when the component is controlled.
         * When the value is `null`, no Tab will be selected.
         */
        value?: TabsTab.Value;
        /**
         * The default value. Use when the component is not controlled.
         * When the value is `null`, no Tab will be selected.
         * @default 0
         */
        defaultValue?: TabsTab.Value;
        /**
         * The component orientation (layout flow direction).
         * @default 'horizontal'
         */
        orientation?: Orientation;
        /**
         * Callback invoked when new value is being set.
         */
        onValueChange?: (value: TabsTab.Value, event?: Event) => void;
    } & HeadlessUIComponentProps<'div', State>;
}
