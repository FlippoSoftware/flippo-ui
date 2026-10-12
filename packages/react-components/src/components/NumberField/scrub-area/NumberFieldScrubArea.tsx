import React from 'react';
import * as ReactDOM from 'react-dom';

import { NumberFieldScrubAreaMachine } from '@flippo-software/core-components/number-field';

import { toReactProps, useMachine, useStoreState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNumberFieldRootContext } from '../root/NumberFieldRootContext';
import { styleHookMapping } from '../utils/styleHooks';

import type { NumberFieldRoot } from '../root/NumberFieldRoot';

import { NumberFieldScrubAreaContext } from './NumberFieldScrubAreaContext';

/**
 * An interactive area where the user can click and drag to change the field value.
 * Renders a `<span>` element.
 */
export function NumberFieldScrubArea(componentProps: NumberFieldScrubArea.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        direction = 'horizontal',
        pixelSensitivity = 2,
        teleportDistance,
        ...elementProps
    } = componentProps;

    const { numberField, state } = useNumberFieldRootContext();

    const scrubArea = useMachine((options) => new NumberFieldScrubAreaMachine(numberField, options), {
        direction,
        pixelSensitivity,
        teleportDistance,
        flushSync: ReactDOM.flushSync
    });
    const scrubState = useStoreState(scrubArea.store);

    // biome-ignore lint/correctness/useExhaustiveDependencies: a new value when the scrub state changes.
    const contextValue = React.useMemo(() => ({ scrubArea }), [scrubArea, scrubState]);

    const element = useRenderElement('span', componentProps, {
        ref: [ref, scrubArea.setScrubArea],
        state,
        props: [toReactProps(scrubArea.getProps()), elementProps],
        customStyleHookMapping: styleHookMapping
    });

    return <NumberFieldScrubAreaContext.Provider value={contextValue}>{element}</NumberFieldScrubAreaContext.Provider>;
}

export type NumberFieldScrubAreaState = {} & NumberFieldRoot.State;

export type NumberFieldScrubAreaProps = {
    /**
     * Cursor movement direction in the scrub area.
     * @default 'horizontal'
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * Determines how many pixels the cursor must move before the value changes.
     * A higher value will make scrubbing less sensitive.
     * @default 2
     */
    pixelSensitivity?: number;
    /**
     * If specified, determines the distance that the cursor may move from the center
     * of the scrub area before it will loop back around.
     */
    teleportDistance?: number | undefined;
} & HeadlessUIComponentProps<'span', NumberFieldScrubArea.State>;

export namespace NumberFieldScrubArea {
    export type State = NumberFieldScrubAreaState;
    export type Props = NumberFieldScrubAreaProps;
}
