'use client';

import React from 'react';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useToolbarRootContext } from '../root/ToolbarRootContext';

import type { ToolbarRoot } from '../root/ToolbarRoot';

import { ToolbarGroupContext } from './ToolbarGroupContext';

import type { TToolbarGroupContext } from './ToolbarGroupContext';

/**
 * Groups several toolbar items or toggles.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Toolbar](https://base-ui.com/react/components/toolbar)
 */
export function ToolbarGroup(componentProps: ToolbarGroup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled: disabledProp = false,
        ref,
        ...elementProps
    } = componentProps;

    const { orientation, disabled: toolbarDisabled } = useToolbarRootContext();

    const disabled = toolbarDisabled || disabledProp;

    const contextValue: TToolbarGroupContext = React.useMemo(
        () => ({
            disabled
        }),
        [disabled]
    );

    const state: ToolbarRoot.State = React.useMemo(
        () => ({
            disabled,
            orientation
        }),
        [disabled, orientation]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{ role: 'group' }, elementProps]
    });

    return (
        <ToolbarGroupContext value={contextValue}>{element}</ToolbarGroupContext>
    );
}

export namespace ToolbarGroup {
    export type Props = {
        /**
         * When `true` all toolbar items in the group are disabled.
         * @default false
         */
        disabled?: boolean;
    } & HeadlessUIComponentProps<'div', ToolbarRoot.State>;
}
