import { TabsPanelMachine } from '@flippo-software/core-components/tabs';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { tabsStyleHookMapping } from '../root/styleHooks';
import { useTabsRootContext } from '../root/TabsRootContext';

import type { TabsRoot } from '../root/TabsRoot';
import type { TabsTab } from '../tab/TabsTab';

/**
 * A panel displayed when the corresponding tab is active.
 * Renders a `<div>` element.
 */
export function TabsPanel(componentProps: TabsPanel.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        value,
        keepMounted = false,
        ref,
        ...elementProps
    } = componentProps;

    const { tabs, orientation, tabActivationDirection } = useTabsRootContext();

    const id = useHeadlessUiId() as string;

    const panel = useMachine((options) => new TabsPanelMachine(tabs, options), { value, keepMounted, id });
    const track = useTracker();
    const panelState = useMachineState(panel);

    const state: TabsPanel.State = { ...panelState, orientation, tabActivationDirection } as TabsPanel.State;

    return useRenderElement('div', componentProps, {
        state,
        ref: [ref, panel.setElement],
        props: [track(() => toReactProps(panel.getProps())), elementProps, { children: panel.rendersChildren ? children : undefined }],
        customStyleHookMapping: tabsStyleHookMapping
    });
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
