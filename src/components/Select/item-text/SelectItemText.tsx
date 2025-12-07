import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectItemContext } from '../item/SelectItemContext';
import { useSelectRootContext } from '../root/SelectRootContext';

/**
 * A text label of the select item.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export const Inner = React.memo(
    (
        componentProps: SelectItemText.Props
    ) => {
        const {
            indexRef,
            textRef,
            selectedByFocus,
            hasRegistered
        } = useSelectItemContext();
        const { selectedItemTextRef } = useSelectRootContext();

        const {
            /* eslint-disable unused-imports/no-unused-vars */
            className,
            render,
            /* eslint-enable unused-imports/no-unused-vars */
            ref,
            ...elementProps
        } = componentProps;

        const localRef = React.useCallback(
            (node: HTMLElement | null) => {
                if (!node || !hasRegistered) {
                    return;
                }
                const hasNoSelectedItemText
                    = selectedItemTextRef.current === null || !selectedItemTextRef.current.isConnected;
                if (selectedByFocus || (hasNoSelectedItemText && indexRef.current === 0)) {
                    selectedItemTextRef.current = node;
                }
            },
            [selectedItemTextRef, indexRef, selectedByFocus, hasRegistered]
        );

        const element = useRenderElement('div', componentProps, {
            ref: [localRef, ref, textRef],
            props: elementProps
        });

        return element;
    }
);

export function SelectItemText(componentProps: SelectItemTextProps) {
    return <Inner {...componentProps} />;
}

export type SelectItemTextState = {};

export type SelectItemTextProps = {} & HeadlessUIComponentProps<'div', SelectItemText.State>;

export namespace SelectItemText {
    export type State = SelectItemTextState;
    export type Props = SelectItemTextProps;
}
