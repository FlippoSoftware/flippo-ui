import React from 'react';

import { ContextMenuTriggerMachine } from '@flippo-software/core-components/context-menu';
import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { toReactProps, useStoreSelector } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { pressableTriggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useContextMenuRootContext } from '../root/ContextMenuRootContext';

/**
 * An area that opens the menu on right click or long press.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Context Menu](https://base-ui.com/react/components/context-menu)
 */
export function ContextMenuTrigger(componentProps: ContextMenuTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const contextMenu = useContextMenuRootContext(false);

    const [trigger] = React.useState(() => new ContextMenuTriggerMachine(contextMenu));
    useIsoLayoutEffect(() => trigger.connect(), [trigger]);

    const open = useStoreSelector(contextMenu.store, 'open');
    const state: ContextMenuTrigger.State = React.useMemo(() => ({ open }), [open]);

    return useRenderElement('div', componentProps, {
        state,
        ref: [ref, trigger.setElement],
        props: [elementProps, (props) => toReactProps(trigger.getTriggerProps(props))],
        customStyleHookMapping: pressableTriggerOpenStateMapping
    });
}

export type ContextMenuTriggerState = {
    /**
     * Whether the context menu is currently open.
     */
    open: boolean;
};

export type ContextMenuTriggerProps = {} & HeadlessUIComponentProps<'div', ContextMenuTrigger.State>;

export namespace ContextMenuTrigger {
    export type State = ContextMenuTriggerState;
    export type Props = ContextMenuTriggerProps;
}
