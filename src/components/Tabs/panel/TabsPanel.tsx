import React from 'react';

import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCompositeListItem } from '../../Composite/list/useCompositeListItem';
import { tabsStyleHookMapping } from '../root/styleHooks';
import { useTabsRootContext } from '../root/TabsRootContext';

import type { TabsRoot } from '../root/TabsRoot';
import type { TabsTab } from '../tab/TabsTab';

import { TabsPanelDataAttributes } from './TabsPanelDataAttributes';

/**
 * A panel displayed when the corresponding tab is active.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Tabs](https://base-ui.com/react/components/tabs)
 */
export function TabsPanel(componentProps: TabsPanel.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        value: valueProp,
        keepMounted = false,
        ref,
        ...elementProps
    } = componentProps;

    const {
        value: selectedValue,
        getTabIdByPanelValueOrIndex,
        orientation,
        tabActivationDirection
    } = useTabsRootContext();

    const id = useHeadlessUiId();

    const metadata = React.useMemo(
        () => ({
            id,
            value: valueProp
        }),
        [id, valueProp]
    );

    const { ref: listItemRef, index } = useCompositeListItem<TabsPanel.Metadata>({
        metadata
    });

    const tabPanelValue = valueProp ?? index;

    const hidden = tabPanelValue !== selectedValue;

    const correspondingTabId = React.useMemo(() => {
        return getTabIdByPanelValueOrIndex(valueProp, index);
    }, [getTabIdByPanelValueOrIndex, index, valueProp]);

    const state: TabsPanel.State = React.useMemo(
        () => ({
            hidden,
            orientation,
            tabActivationDirection
        }),
        [hidden, orientation, tabActivationDirection]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, listItemRef],
        props: [{
            'aria-labelledby': correspondingTabId,
            hidden,
            'id': id ?? undefined,
            'role': 'tabpanel',
            'tabIndex': hidden ? -1 : 0,
            [TabsPanelDataAttributes.index as string]: index
        }, elementProps, { children: hidden && !keepMounted ? undefined : children }],
        customStyleHookMapping: tabsStyleHookMapping
    });

    return element;
}

export type TabsPanelMetadata = {
    id?: string;
    value: TabsTab.Value;
};

export type TabsPanelState = {
    hidden: boolean;
} & TabsRoot.State;

export type TabsPanelProps = {
    /**
     * The value of the TabPanel. It will be shown when the Tab with the corresponding value is selected.
     * If not provided, it will fall back to the index of the panel.
     * It is recommended to explicitly provide it, as it's required for the tab panel to be rendered on the server.
     */
    value?: TabsTab.Value;
    /**
     * Whether to keep the HTML element in the DOM while the panel is hidden.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'div', TabsPanel.State>;

export namespace TabsPanel {
    export type Metadata = TabsPanelMetadata;
    export type State = TabsPanelState;
    export type Props = TabsPanelProps;
}
