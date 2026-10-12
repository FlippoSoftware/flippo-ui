import React from 'react';

import { TabsMachine } from '@flippo-software/core-components/tabs';

import type { TabsOptions } from '@flippo-software/core-components/tabs';

import { useMachine, useStoreState } from '~@lib/core';
import { useDirection, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { REASONS } from '~@lib/reason';
import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import type { TabsTab } from '../tab/TabsTab';

import { tabsStyleHookMapping } from './styleHooks';
import { TabsRootContext } from './TabsRootContext';

import type { TabsRootContextValue } from './TabsRootContext';

/**
 * Groups the tabs and the corresponding panels.
 * Renders a `<div>` element.
 */
export function TabsRoot(componentProps: TabsRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        defaultValue = 0,
        onValueChange,
        orientation = 'horizontal',
        value,
        ref,
        ...elementProps
    } = componentProps;

    const direction = useDirection();

    const tabs = useMachine((options) => new TabsMachine(options), {
        value,
        defaultValue,
        orientation,
        onValueChange: onValueChange as TabsOptions['onValueChange'],
        direction
    });
    const internalState = useStoreState(tabs.store);

    const tabsValue = tabs.value;
    const { tabActivationDirection } = internalState;

    // biome-ignore lint/correctness/useExhaustiveDependencies: `internalState` holds the tab and panel maps the lookups read.
    const tabsContextValue: TabsRootContextValue = React.useMemo(
        () => ({
            direction,
            getTabElementBySelectedValue: (selectedValue) => tabs.getTabElementBySelectedValue(selectedValue),
            getTabIdByPanelValueOrIndex: (panelValue, index) => tabs.getTabIdByPanelValueOrIndex(panelValue, index),
            getTabPanelIdByTabValueOrIndex: (tabValue, index) => tabs.getTabPanelIdByTabValueOrIndex(tabValue, index),
            onValueChange: tabs.onValueChange as TabsRootContextValue['onValueChange'],
            orientation,
            setTabMap: tabs.setTabMap as unknown as TabsRootContextValue['setTabMap'],
            tabActivationDirection,
            value: tabsValue,
            tabs
        }),
        [direction, tabs, orientation, tabActivationDirection, tabsValue, internalState]
    );

    const state: TabsRoot.State = { orientation, tabActivationDirection };

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: tabsStyleHookMapping
    });

    return <TabsRootContext.Provider value={tabsContextValue}>{element}</TabsRootContext.Provider>;
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
