import React from 'react';

import { ToolbarMachine } from '@flippo-software/core-components/toolbar';

import { toReactProps, useMachine } from '~@lib/core';
import { useDirection, useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { CompositeMachineProvider } from '../../Composite/root/CompositeMachineProvider';

import { ToolbarRootContext } from './ToolbarRootContext';

import type { ToolbarRootContextValue } from './ToolbarRootContext';

/**
 * A container for grouping a set of controls, such as buttons, toggle groups, or menus.
 * Renders a `<div>` element.
 */
export function ToolbarRoot(componentProps: ToolbarRoot.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        cols = 1,
        disabled = false,
        loopFocus = true,
        orientation = 'horizontal',
        ref,
        ...elementProps
    } = componentProps;

    const direction = useDirection();
    const toolbar = useMachine((options) => new ToolbarMachine(options), { cols, disabled, loopFocus, orientation, direction });

    const toolbarRootContext: ToolbarRootContextValue = React.useMemo(
        () => ({ disabled, orientation, toolbar }),
        [disabled, orientation, toolbar]
    );

    const state = React.useMemo(() => ({ disabled, orientation }), [disabled, orientation]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, toolbar.composite.setRoot],
        props: [toReactProps(toolbar.getRootProps()), elementProps]
    });

    return (
        <ToolbarRootContext value={toolbarRootContext}>
            <CompositeMachineProvider composite={toolbar.composite}>{element}</CompositeMachineProvider>
        </ToolbarRootContext>
    );
}

export namespace ToolbarRoot {
    export type ItemMetadata = {
        focusableWhenDisabled: boolean;
    };

    export type State = {
        disabled: boolean;
        orientation: Orientation;
    };

    export type Props = {
        /**
         * The number of columns. When greater than 1, the toolbar is arranged into
         * a grid.
         * @default 1
         */
        cols?: number;
        disabled?: boolean;
        /**
         * The orientation of the toolbar.
         * @default 'horizontal'
         */
        orientation?: Orientation;
        /**
         * If `true`, using keyboard navigation will wrap focus to the other end of the toolbar once the end is reached.
         *
         * @default true
         */
        loopFocus?: boolean;
    } & HeadlessUIComponentProps<'div', State>;
}
