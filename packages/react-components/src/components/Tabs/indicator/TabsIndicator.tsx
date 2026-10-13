import React from 'react';

import { getTabsIndicatorGeometry } from '@flippo-software/core-components/tabs';
import { useForcedRerendering, useOnMount } from '@flippo-software/react-hooks';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useTabsListContext } from '../list/TabsListContext';
import { tabsStyleHookMapping } from '../root/styleHooks';
import { useTabsRootContext } from '../root/TabsRootContext';

import type { TabsRoot } from '../root/TabsRoot';
import type { TabsTab } from '../tab/TabsTab';

import { script as prehydrationScript } from './prehydrationScript.min';

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
        renderBeforeHydration = false,
        ref,
        ...elementProps
    } = componentProps;

    const { tabs, orientation, tabActivationDirection, value } = useTabsRootContext();

    const { tabsListElement } = useTabsListContext();

    const [isMounted, setIsMounted] = React.useState(false);

    useOnMount(() => setIsMounted(true));

    const rerender = useForcedRerendering();

    // The indicator follows the active tab when the list resizes.
    React.useEffect(() => {
        if (value != null && tabsListElement != null && typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(rerender);

            resizeObserver.observe(tabsListElement);

            return () => {
                resizeObserver.disconnect();
            };
        }

        return;
    }, [value, tabsListElement, rerender]);

    const {
        position: activeTabPosition,
        size: activeTabSize,
        style,
        displayed: displayIndicator
    } = getTabsIndicatorGeometry(tabs, tabsListElement);

    const state: TabsIndicator.State = React.useMemo(
        () => ({
            orientation,
            activeTabPosition,
            activeTabSize,
            tabActivationDirection
        }),
        [orientation, activeTabPosition, activeTabSize, tabActivationDirection]
    );

    const element = useRenderElement('span', componentProps, {
        state,
        ref,
        props: [
            {
                role: 'presentation',
                style,
                hidden: !displayIndicator // do not display the indicator before the layout is settled
            },
            elementProps,
            {
                suppressHydrationWarning: true
            }
        ],
        customStyleHookMapping
    });

    if (value == null) {
        return null;
    }

    return (
        <React.Fragment>
            {element}
            {!isMounted && renderBeforeHydration && (
                // biome-ignore lint/security/noDangerouslySetInnerHtml: the script is a constant built from this package's own source (prehydrationScript.template.js).
                <script dangerouslySetInnerHTML={{ __html: prehydrationScript }} suppressHydrationWarning={true} />
            )}
        </React.Fragment>
    );
}

export type TabsIndicatorState = {
    activeTabPosition: TabsTab.Position | null;
    activeTabSize: TabsTab.Size | null;
    orientation: TabsRoot.Orientation;
} & TabsRoot.State;

export type TabsIndicatorProps = {
    /**
     * Whether to render itself before React hydrates.
     * This minimizes the time that the indicator isn’t visible after server-side rendering.
     * @default false
     */
    renderBeforeHydration?: boolean;
} & HeadlessUIComponentProps<'span', TabsIndicator.State>;

export namespace TabsIndicator {
    export type State = TabsIndicatorState;
    export type Props = TabsIndicatorProps;
}
