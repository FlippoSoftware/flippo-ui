import React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import { EMPTY_ARRAY } from '~@lib/constants';

import type { HeadlessUIComponentProps, HTMLProps } from '~@lib/types';

import { CompositeRoot } from '../../Composite/root/CompositeRoot';
import { tabsStyleHookMapping } from '../root/styleHooks';
import { useTabsRootContext } from '../root/TabsRootContext';

import type { TabsRoot } from '../root/TabsRoot';
import type { TabsTab } from '../tab/TabsTab';

import { TabsListContext } from './TabsListContext';

import type { TabsListContextValue } from './TabsListContext';

/**
 * Groups the individual tab buttons.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Tabs](https://base-ui.com/react/components/tabs)
 */
export function TabsList(componentProps: TabsList.Props) {
    const {
        activateOnFocus = false,
        className,
        loopFocus = true,
        render,
        ref,
        ...elementProps
    } = componentProps;

    const {
        getTabElementBySelectedValue,
        onValueChange,
        orientation,
        value,
        setTabMap,
        tabActivationDirection
    } = useTabsRootContext();

    const [highlightedTabIndex, setHighlightedTabIndex] = React.useState(0);

    const [tabsListElement, setTabsListElement] = React.useState<HTMLElement | null>(null);

    const detectActivationDirection = useActivationDirectionDetector(
        value, // the old value
        orientation,
        tabsListElement,
        getTabElementBySelectedValue
    );

    const onTabActivation = useStableCallback(
        (newValue: TabsTab.Value, eventDetails: TabsRoot.ChangeEventDetails) => {
            if (newValue !== value) {
                const activationDirection = detectActivationDirection(newValue);
                eventDetails.activationDirection = activationDirection;
                onValueChange(newValue, eventDetails);
            }
        }
    );

    const state: TabsList.State = React.useMemo(
        () => ({
            orientation,
            tabActivationDirection
        }),
        [orientation, tabActivationDirection]
    );

    const defaultProps: HTMLProps = {
        'aria-orientation': orientation === 'vertical' ? 'vertical' : undefined,
        'role': 'tablist'
    };

    const tabsListContextValue: TabsListContextValue = React.useMemo(
        () => ({
            activateOnFocus,
            highlightedTabIndex,
            onTabActivation,
            setHighlightedTabIndex,
            tabsListElement,
            value
        }),
        [
            activateOnFocus,
            highlightedTabIndex,
            onTabActivation,
            setHighlightedTabIndex,
            tabsListElement,
            value
        ]
    );

    return (
        <TabsListContext.Provider value={tabsListContextValue}>
            <CompositeRoot
                render={render}
                className={className}
                state={state}
                refs={[ref, setTabsListElement]}
                props={[defaultProps, elementProps]}
                stateAttributesMapping={tabsStyleHookMapping}
                highlightedIndex={highlightedTabIndex}
                enableHomeAndEndKeys
                loopFocus={loopFocus}
                orientation={orientation}
                onHighlightedIndexChange={setHighlightedTabIndex}
                onMapChange={setTabMap}
                disabledIndices={EMPTY_ARRAY as number[]}
            />
        </TabsListContext.Provider>
    );
}

function getInset(tab: HTMLElement, tabsList: HTMLElement) {
    const { left: tabLeft, top: tabTop } = tab.getBoundingClientRect();
    const { left: listLeft, top: listTop } = tabsList.getBoundingClientRect();

    const left = tabLeft - listLeft;
    const top = tabTop - listTop;

    return { left, top };
}

function useActivationDirectionDetector(
    // the old value
    activeTabValue: any,
    orientation: TabsRoot.Orientation,
    tabsListElement: HTMLElement | null,
    getTabElement: (selectedValue: any) => HTMLElement | null
): (newValue: any) => TabsTab.ActivationDirection {
    const [previousTabEdge, setPreviousTabEdge] = React.useState<number | null>(null);

    useIsoLayoutEffect(() => {
        // Whenever orientation changes, reset the state.
        if (activeTabValue == null || tabsListElement == null) {
            setPreviousTabEdge(null);
            return;
        }

        const activeTab = getTabElement(activeTabValue);
        if (activeTab == null) {
            setPreviousTabEdge(null);
            return;
        }

        const { left, top } = getInset(activeTab, tabsListElement);
        setPreviousTabEdge(orientation === 'horizontal' ? left : top);
    }, [orientation, getTabElement, tabsListElement, activeTabValue]);

    return React.useCallback(
        (newValue: any) => {
            if (newValue === activeTabValue) {
                return 'none';
            }

            if (newValue == null) {
                setPreviousTabEdge(null);
                return 'none';
            }

            if (newValue != null && tabsListElement != null) {
                const activeTabElement = getTabElement(newValue);

                if (activeTabElement != null) {
                    const { left, top } = getInset(activeTabElement, tabsListElement);

                    if (previousTabEdge == null) {
                        setPreviousTabEdge(orientation === 'horizontal' ? left : top);
                        return 'none';
                    }

                    if (orientation === 'horizontal') {
                        if (left < previousTabEdge) {
                            setPreviousTabEdge(left);
                            return 'left';
                        }
                        if (left > previousTabEdge) {
                            setPreviousTabEdge(left);
                            return 'right';
                        }
                    }
                    else if (top < previousTabEdge) {
                        setPreviousTabEdge(top);
                        return 'up';
                    }
                    else if (top > previousTabEdge) {
                        setPreviousTabEdge(top);
                        return 'down';
                    }
                }
            }

            return 'none';
        },
        [
            getTabElement,
            orientation,
            previousTabEdge,
            tabsListElement,
            activeTabValue
        ]
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
