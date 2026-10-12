import React from 'react';

import { TabsListMachine } from '@flippo-software/core-components/tabs';

import { toReactProps, useMachine, useStoreState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { CompositeMachineProvider } from '../../Composite/root/CompositeMachineProvider';
import { tabsStyleHookMapping } from '../root/styleHooks';
import { useTabsRootContext } from '../root/TabsRootContext';

import type { TabsRoot } from '../root/TabsRoot';

import { TabsListContext } from './TabsListContext';

import type { TabsListContextValue } from './TabsListContext';

/**
 * Groups the individual tab buttons.
 * Renders a `<div>` element.
 */
export function TabsList(componentProps: TabsList.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        activateOnFocus = false,
        loopFocus = true,
        ref,
        ...elementProps
    } = componentProps;

    const { tabs, orientation, tabActivationDirection, value } = useTabsRootContext();

    const list = useMachine((options) => new TabsListMachine(tabs, options), { activateOnFocus, loopFocus });
    const { highlightedTabIndex, listElement } = useStoreState(list.store);

    const state: TabsList.State = React.useMemo(() => ({ orientation, tabActivationDirection }), [orientation, tabActivationDirection]);

    const tabsListContextValue: TabsListContextValue = React.useMemo(
        () => ({
            activateOnFocus,
            highlightedTabIndex,
            onTabActivation: list.onTabActivation as TabsListContextValue['onTabActivation'],
            setHighlightedTabIndex: list.setHighlightedTabIndex,
            tabsListElement: listElement,
            value,
            list
        }),
        [activateOnFocus, highlightedTabIndex, list, listElement, value]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, list.setListElement],
        props: [elementProps, (props) => toReactProps(list.getRootProps(props))],
        customStyleHookMapping: tabsStyleHookMapping
    });

    return (
        <TabsListContext.Provider value={tabsListContextValue}>
            <CompositeMachineProvider composite={list.composite}>{element}</CompositeMachineProvider>
        </TabsListContext.Provider>
    );
}

export type TabsListState = {} & TabsRoot.State;

export type TabsListProps = {
    /**
     * Whether to automatically change the active tab on arrow key focus.
     * Otherwise, tabs will be activated using <kbd>Enter</kbd> or <kbd>Space</kbd> key press.
     * @default false
     */
    activateOnFocus?: boolean;
    /**
     * Whether to loop keyboard focus back to the first item
     * when the end of the list is reached while using the arrow keys.
     * @default true
     */
    loopFocus?: boolean;
} & HeadlessUIComponentProps<'div', TabsList.State>;

export namespace TabsList {
    export type State = TabsListState;
    export type Props = TabsListProps;
}
