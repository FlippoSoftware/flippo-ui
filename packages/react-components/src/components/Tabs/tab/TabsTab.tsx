import { TabsTabMachine } from '@flippo-software/core-components/tabs';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useTabsListContext } from '../list/TabsListContext';
import { useTabsRootContext } from '../root/TabsRootContext';

import type { TabsRoot } from '../root/TabsRoot';

/**
 * An individual interactive tab button that toggles the corresponding panel.
 * Renders a `<button>` element.
 */
export function TabsTab(componentProps: TabsTab.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled,
        value,
        id: idProp,
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const { tabs } = useTabsRootContext();
    const { list } = useTabsListContext();

    const id = useHeadlessUiId(idProp) as string;

    const tab = useMachine((options) => new TabsTabMachine(tabs, list, options), { disabled, value, nativeButton, id });
    const state: TabsTab.State = useMachineState(tab);
    const track = useTracker();

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, tab.setElement],
        props: [elementProps, (props) => track(() => toReactProps(tab.getProps(props)))]
    });
}

export type TabsTabValue = any | null;

export type TabsTabActivationDirection = 'left' | 'right' | 'up' | 'down' | 'none';

export type TabsTabPosition = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

export type TabsTabSize = {
    width: number;
    height: number;
};

export type TabsTabMetadata = {
    disabled: boolean;
    id: string | undefined;
    value: any | undefined;
};

export type TabsTabState = {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    active: boolean;
    orientation: TabsRoot.Orientation;
};

export type TabsTabProps = {
    /**
     * The value of the Tab.
     * When not specified, the value is the child position index.
     */
    value?: TabsTab.Value;
} & NativeButtonProps &
    HeadlessUIComponentProps<'button', TabsTab.State>;

export namespace TabsTab {
    export type Value = TabsTabValue;
    export type ActivationDirection = TabsTabActivationDirection;
    export type Position = TabsTabPosition;
    export type Size = TabsTabSize;
    export type Metadata = TabsTabMetadata;
    export type State = TabsTabState;
    export type Props = TabsTabProps;
}
