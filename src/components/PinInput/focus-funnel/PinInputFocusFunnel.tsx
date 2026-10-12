import React from 'react';

import { toReactProps, useSyncDuringRender } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePinInputRootContext } from '../root/PinInputRootContext';
import { pinInputStyleHookMapping } from '../utils/styleHooks';

import type { PinInputRoot } from '../root/PinInputRoot';

import { PinInputFocusFunnelContext } from './PinInputFocusFunnelContext';

/**
 * Routes focus and typing to the right pin (e.g. the first empty one).
 * Renders a `<div>` element.
 */
export function PinInputFocusFunnel(componentProps: PinInputFocusFunnel.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        focusMode = 'first-empty',
        ...elementProps
    } = componentProps;

    const { pinInput, state } = usePinInputRootContext();

    // The pins (rendered below) follow the funnel's focus mode.
    useSyncDuringRender(() => pinInput.setFocusFunnelMode(focusMode));

    const context = React.useMemo(() => ({ focusMode }), [focusMode]);

    const element = useRenderElement('div', componentProps, {
        ref,
        state,
        props: [toReactProps(pinInput.getFocusFunnelProps(focusMode)), elementProps],
        customStyleHookMapping: pinInputStyleHookMapping
    });

    return <PinInputFocusFunnelContext value={context}>{element}</PinInputFocusFunnelContext>;
}

export namespace PinInputFocusFunnel {
    export type State = PinInputRoot.State;

    export type FocusMode = 'last-active' | 'first-empty' | 'first';

    export type Props = HeadlessUIComponentProps<'div', State> & {
        /**
         * Focus mode for the focus funnel
         * - 'last-active': Focus on the last active input (default)
         * - 'first-empty': Focus on the first empty input
         * - 'first': Always focus on the first input
         */
        focusMode?: FocusMode;
    };
}
