import React from 'react';

import { useControlledState } from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { useDirection, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { CompositeList } from '../../Composite/list/CompositeList';

import type { CompositeMetadata } from '../../Composite/list/CompositeList';
import type { TabsPanel } from '../panel/TabsPanel';
import type { TabsTab } from '../tab/TabsTab';

import { tabsStyleHookMapping } from './styleHooks';
import { TabsRootContext } from './TabsRootContext';

import type { TabsRootContextValue } from './TabsRootContext';

export function TabsRoot(componentProps: TabsRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        defaultValue = 0,
        onValueChange: onValueChangeProp,
        orientation = 'horizontal',
        value: valueProp,
        ref,
        ...elementProps
    } = componentProps;

    const direction = useDirection();

    const tabPanelRefs = React.useRef<(HTMLElement | null)[]>([]);

    const [value, setValue] = useControlledState({
        prop: valueProp,
        defaultProp: defaultValue,
        caller: 'Tabs'
    });

    const [tabPanelMap, setTabPanelMap] = React.useState(
        () => new Map<Node, CompositeMetadata<TabsPanel.Metadata> | null>()
    );
    const [tabMap, setTabMap] = React.useState(
        () => new Map<Node, CompositeMetadata<TabsTab.Metadata> | null>()
    );

    const [tabActivationDirection, setTabActivationDirection]
        = React.useState<TabsTab.ActivationDirection>('none');

    const onValueChange = useStableCallback(
        (newValue: TabsTab.Value, eventDetails: TabsRoot.ChangeEventDetails) => {
            onValueChangeProp?.(newValue, eventDetails);

            if (eventDetails.isCanceled) {
                return;
            }

            setValue(newValue);
            setTabActivationDirection(eventDetails.activationDirection);
        }
    );

    // get the `id` attribute of <Tabs.Panel> to set as the value of `aria-controls` on <Tabs.Tab>
    const getTabPanelIdByTabValueOrIndex = React.useCallback(
        (tabValue: TabsTab.Value | undefined, index: number) => {
            if (tabValue === undefined && index < 0) {
                return undefined;
            }

            for (const tabPanelMetadata of tabPanelMap.values()) {
                // find by tabValue
                if (tabValue !== undefined && tabPanelMetadata && tabValue === tabPanelMetadata?.value) {
                    return tabPanelMetadata.id;
                }

                // find by index
                if (
                    tabValue === undefined
                    && tabPanelMetadata?.index
                    && tabPanelMetadata?.index === index
                ) {
                    return tabPanelMetadata.id;
                }
            }

            return undefined;
        },
        [tabPanelMap]
    );

    // get the `id` attribute of <Tabs.Tab> to set as the value of `aria-labelledby` on <Tabs.Panel>
    const getTabIdByPanelValueOrIndex = React.useCallback(
        (tabPanelValue: TabsTab.Value | undefined, index: number) => {
            if (tabPanelValue === undefined && index < 0) {
                return undefined;
            }

            for (const tabMetadata of tabMap.values()) {
                // find by tabPanelValue
                if (
                    tabPanelValue !== undefined
                    && index > -1
                    && tabPanelValue === (tabMetadata?.value ?? tabMetadata?.index ?? undefined)
                ) {
                    return tabMetadata?.id;
                }

                // find by index
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

    // used in `useActivationDirectionDetector` for setting data-activation-direction
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

    const tabsContextValue: TabsRootContextValue = React.useMemo(
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

    const state: TabsRoot.State = {
        orientation,
        tabActivationDirection
    };

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: tabsStyleHookMapping
    });

    return (
        <TabsRootContext.Provider value={tabsContextValue}>
            <CompositeList<TabsPanel.Metadata> elementsRef={tabPanelRefs} onMapChange={setTabPanelMap}>
                {element}
            </CompositeList>
        </TabsRootContext.Provider>
    );
}

export type TabsRootOrientation = Orientation;

export type TabsRootState = {
    orientation: TabsRoot.Orientation;
    tabActivationDirection: TabsTab.ActivationDirection;
};

export type TabsRootProps = {
    /**
     * The value of the currently active `Tab`. Use when the component is controlled.
     * When the value is `null`, no Tab will be active.
     */
    value?: TabsTab.Value;
    /**
     * The default value. Use when the component is not controlled.
     * When the value is `null`, no Tab will be active.
     * @default 0
     */
    defaultValue?: TabsTab.Value;
    /**
     * The component orientation (layout flow direction).
     * @default 'horizontal'
     */
    orientation?: TabsRoot.Orientation;
    /**
     * Callback invoked when new value is being set.
     */
    onValueChange?: (value: TabsTab.Value, eventDetails: TabsRoot.ChangeEventDetails) => void;
} & HeadlessUIComponentProps<'div', TabsRoot.State>;

export type TabsRootChangeEventReason = typeof REASONS.none;
export type TabsRootChangeEventDetails = HeadlessUIChangeEventDetails<
    TabsRoot.ChangeEventReason,
    { activationDirection: TabsTab.ActivationDirection }
>;

export namespace TabsRoot {
    export type State = TabsRootState;
    export type Props = TabsRootProps;
    export type Orientation = TabsRootOrientation;
    export type ChangeEventReason = TabsRootChangeEventReason;
    export type ChangeEventDetails = TabsRootChangeEventDetails;
}
