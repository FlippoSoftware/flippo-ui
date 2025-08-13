'use client';

import React from 'react';

import { useForcedRerendering } from '@flippo_ui/hooks';

import { generateId } from '@lib/generateId';
import { useDirection, useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps, Orientation } from '@lib/types';

import { useTabsListContext } from '../list/TabsListContext';
import { tabsStyleHookMapping } from '../root/styleHooks';
import { useTabsRootContext } from '../root/TabsRootContext';

import type { TabsRoot } from '../root/TabsRoot';
import type { TabsTab } from '../tab/TabsTab';

import { TabsIndicatorCssVars } from './TabsIndicatorCssVars';

const customStyleHookMapping = {
    ...tabsStyleHookMapping,
    selectedTabPosition: () => null,
    selectedTabSize: () => null
};

/**
 * A visual indicator that can be styled to match the position of the currently active tab.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Tabs](https://base-ui.com/react/components/tabs)
 */
export function TabsIndicator(componentProps: TabsIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const {
        getTabElementBySelectedValue,
        orientation,
        tabActivationDirection,
        value
    }
        = useTabsRootContext();

    const { tabsListRef } = useTabsListContext();

    const [instanceId] = React.useState(() => generateId('tab'));
    const { value: activeTabValue } = useTabsRootContext();

    const direction = useDirection();

    const rerender = useForcedRerendering();

    React.useEffect(() => {
        if (value != null && tabsListRef.current != null && typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(() => {
                rerender();
            });

            resizeObserver.observe(tabsListRef.current);

            return () => {
                resizeObserver.disconnect();
            };
        }

        return undefined;
    }, [value, tabsListRef, rerender]);

    let left = 0;
    let right = 0;
    let top = 0;
    let bottom = 0;
    let width = 0;
    let height = 0;

    let isTabSelected = false;

    if (value != null && tabsListRef.current != null) {
        const selectedTab = getTabElementBySelectedValue(value);
        const tabsList = tabsListRef.current;
        isTabSelected = true;

        if (selectedTab != null) {
            left = selectedTab.offsetLeft - tabsList.clientLeft;
            right
                = direction === 'ltr'
                    ? tabsList.scrollWidth
                    - selectedTab.offsetLeft
                    - selectedTab.offsetWidth
                    - tabsList.clientLeft
                    : selectedTab.offsetLeft - tabsList.clientLeft;
            top = selectedTab.offsetTop - tabsList.clientTop;
            bottom
                = tabsList.scrollHeight
                  - selectedTab.offsetTop
                  - selectedTab.offsetHeight
                  - tabsList.clientTop;
            width = selectedTab.offsetWidth;
            height = selectedTab.offsetHeight;
        }
    }

    const selectedTabPosition = React.useMemo(
        () =>
            isTabSelected
                ? {
                    left,
                    right,
                    top,
                    bottom
                }
                : null,
        [
            left,
            right,
            top,
            bottom,
            isTabSelected
        ]
    );

    const selectedTabSize = React.useMemo(
        () =>
            isTabSelected
                ? {
                    width,
                    height
                }
                : null,
        [width, height, isTabSelected]
    );

    const style = React.useMemo(() => {
        if (!isTabSelected) {
            return undefined;
        }

        return {
            [TabsIndicatorCssVars.activeTabLeft]: `${left}px`,
            [TabsIndicatorCssVars.activeTabRight]: `${right}px`,
            [TabsIndicatorCssVars.activeTabTop]: `${top}px`,
            [TabsIndicatorCssVars.activeTabBottom]: `${bottom}px`,
            [TabsIndicatorCssVars.activeTabWidth]: `${width}px`,
            [TabsIndicatorCssVars.activeTabHeight]: `${height}px`
        } as React.CSSProperties;
    }, [
        left,
        right,
        top,
        bottom,
        width,
        height,
        isTabSelected
    ]);

    const displayIndicator = isTabSelected && width > 0 && height > 0;

    const state: TabsIndicator.State = React.useMemo(
        () => ({
            orientation,
            selectedTabPosition,
            selectedTabSize,
            tabActivationDirection
        }),
        [
            orientation,
            selectedTabPosition,
            selectedTabSize,
            tabActivationDirection
        ]
    );

    const element = useRenderElement('span', componentProps, {
        state,
        ref,
        props: [{
            role: 'presentation',
            style,
            hidden: !displayIndicator // do not display the indicator before the layout is settled
        }, elementProps, {
            ['data-instance-id' as string]: instanceId,
            suppressHydrationWarning: true
        }],
        customStyleHookMapping
    });

    if (activeTabValue == null) {
        return null;
    }

    return (
        <React.Fragment>
            {element}
        </React.Fragment>
    );
}

export namespace TabsIndicator {
    export type State = {
        selectedTabPosition: TabsTab.Position | null;
        selectedTabSize: TabsTab.Size | null;
        orientation: Orientation;
    } & TabsRoot.State;

    export type Props = HeadlessUIComponentProps<'span', State>;
}
