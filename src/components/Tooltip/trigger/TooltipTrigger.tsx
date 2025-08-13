'use client';

import React from 'react';

import { useRenderElement } from '@lib/hooks/';
import { triggerOpenStateMapping } from '@lib/popupStateMapping';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useTooltipRootContext } from '../root/TooltipRootContext';

export function TooltipTrigger(
    componentProps: NTooltipTrigger.Props
) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { open, setTriggerElement, triggerProps } = useTooltipRootContext();

    const state: NTooltipTrigger.State = React.useMemo(() => ({ open }), [open]);

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, setTriggerElement],
        props: [triggerProps, elementProps],
        customStyleHookMapping: triggerOpenStateMapping
    });

    return element;
}

export namespace NTooltipTrigger {
    export type State = {
        open: boolean;
    };

    export type Props = HeadlessUIComponentProps<'button', State>;
}
