import React from 'react';

import { ButtonMachine } from '@flippo-software/core-components/button';
import { getComboboxChipRemoveProps, comboboxSelectors as selectors } from '@flippo-software/core-components/combobox';

import { toReactProps, useMachine, useSelector } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useComboboxChipContext } from '../chip/ComboboxChipContext';
import { useComboboxRootMachine } from '../root/ComboboxRootContext';

/**
 * A button to remove a chip.
 * Renders a `<button>` element.
 */
export function ComboboxChipRemove(componentProps: ComboboxChipRemove.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        nativeButton = true,
        ref,
        ...elementProps
    } = componentProps;

    const root = useComboboxRootMachine();
    const { index } = useComboboxChipContext();
    const disabled = useSelector(root.store, selectors.disabled);

    const button = useMachine((options) => new ButtonMachine(options), { disabled, native: nativeButton });

    const state: ComboboxChipRemove.State = React.useMemo(() => ({ disabled }), [disabled]);

    return useRenderElement('button', componentProps, {
        ref: [ref, button.setElement],
        state,
        props: [elementProps, (props) => toReactProps(getComboboxChipRemoveProps(root, index, button, props))]
    });
}

export type ComboboxChipRemoveState = {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
};

export type ComboboxChipRemoveProps = {} & NativeButtonProps & HeadlessUIComponentProps<'button', ComboboxChipRemove.State>;

export namespace ComboboxChipRemove {
    export type State = ComboboxChipRemoveState;
    export type Props = ComboboxChipRemoveProps;
}
