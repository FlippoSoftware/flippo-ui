import type { TransitionStatus } from '@flippo-software/react-hooks';

import { toReactProps, useSyncDuringRender } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCollapsibleRootContext } from '../root/CollapsibleRootContext';
import { collapsibleStyleHookMapping } from '../root/styleHooks';

import type { CollapsibleRoot } from '../root/CollapsibleRoot';

/**
 * A panel with the collapsible contents.
 * Renders a `<div>` element.
 */
export function CollapsiblePanel(componentProps: CollapsiblePanelProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        hiddenUntilFound,
        keepMounted,
        id,
        ref,
        ...elementProps
    } = componentProps;

    const { collapsible, state } = useCollapsibleRootContext();

    useSyncDuringRender(() => collapsible.setPanelOptions({ id, hiddenUntilFound, keepMounted }));

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, collapsible.setPanel],
        props: [toReactProps(collapsible.getPanelProps()), elementProps],
        customStyleHookMapping: collapsibleStyleHookMapping
    });

    if (!collapsible.shouldRenderPanel()) {
        return null;
    }

    return element;
}

export type CollapsiblePanelState = {
    transitionStatus: TransitionStatus;
} & CollapsibleRoot.State;

export type CollapsiblePanelProps = {
    /**
     * Allows the browser’s built-in page search to find and expand the panel contents.
     *
     * Overrides the `keepMounted` prop and uses `hidden="until-found"`
     * to hide the element without removing it from the DOM.
     *
     * @default false
     */
    hiddenUntilFound?: boolean;
    /**
     * Whether to keep the element in the DOM while the panel is hidden.
     * This prop is ignored when `hiddenUntilFound` is used.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'div', CollapsiblePanel.State>;

export namespace CollapsiblePanel {
    export type State = CollapsiblePanelState;
    export type Props = CollapsiblePanelProps;
}
