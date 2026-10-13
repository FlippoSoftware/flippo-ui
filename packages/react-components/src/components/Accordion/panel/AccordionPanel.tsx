import React from 'react';

import type { TransitionStatus } from '@flippo-software/react-hooks';

import { toReactProps, useSyncDuringRender } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCollapsibleRootContext } from '../../Collapsible/root/CollapsibleRootContext';
import { useAccordionItemContext } from '../item/AccordionItemContext';
import { accordionStyleHookMapping } from '../item/styleHooks';

import type { AccordionItem } from '../item/AccordionItem';
import type { AccordionRoot } from '../root/AccordionRoot';

/**
 * A collapsible panel with the accordion item contents.
 * Renders a `<div>` element.
 */
export function AccordionPanel(componentProps: AccordionPanelProps) {
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

    const { item, state } = useAccordionItemContext();
    const { collapsible, state: collapsibleState } = useCollapsibleRootContext();

    useSyncDuringRender(() => item.setPanelOptions({ id, hiddenUntilFound, keepMounted }));

    const panelState: AccordionPanel.State = React.useMemo(
        () => ({ ...state, transitionStatus: collapsibleState.transitionStatus }),
        [state, collapsibleState.transitionStatus]
    );

    const element = useRenderElement('div', componentProps, {
        state: panelState,
        ref: [ref, collapsible.setPanel],
        props: [toReactProps(item.getPanelProps()), elementProps],
        customStyleHookMapping: accordionStyleHookMapping
    });

    if (!collapsible.shouldRenderPanel()) {
        return null;
    }

    return element;
}

export type AccordionPanelState = {
    transitionStatus: TransitionStatus;
} & AccordionItem.State;

export type AccordionPanelProps = {} & HeadlessUIComponentProps<'div', AccordionPanel.State> &
    Pick<AccordionRoot.Props, 'hiddenUntilFound' | 'keepMounted'>;

export namespace AccordionPanel {
    export type State = AccordionPanelState;
    export type Props = AccordionPanelProps;
}
