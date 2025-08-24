'use client';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useFieldRootContext } from '../../Field/root/FieldRootContext';
import { useSwitchRootContext } from '../root/SwitchRootContext';
import { styleHookMapping } from '../styleHooks';

import type { SwitchRoot } from '../root/SwitchRoot';

/**
 * The movable part of the switch that indicates whether the switch is on or off.
 * Renders a `<span>`.
 *
 * Documentation: [Base UI Switch](https://base-ui.com/react/components/switch)
 */
export function SwitchThumb(componentProps: SwitchThumb.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { state: fieldState } = useFieldRootContext();

    const state = useSwitchRootContext();
    const extendedState = { ...fieldState, ...state };

    return useRenderElement('span', componentProps, {
        state: extendedState,
        ref,
        customStyleHookMapping: styleHookMapping,
        props: elementProps
    });
}

export namespace SwitchThumb {
    export type State = SwitchRoot.State;

    export type Props = HeadlessUIComponentProps<'span', State>;
}
