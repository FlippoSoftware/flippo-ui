

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
export function SelectItemText(
    componentProps: SelectItemText.Props
) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { indexRef, textRef, selectedByFocus } = useSelectItemContext();
    const { selectedItemTextRef } = useSelectRootContext();

    const localRef = React.useCallback(
        (node: HTMLElement | null) => {
            if (!node) {
                return;
            }
            // Wait for the DOM indices to be set.
            queueMicrotask(() => {
                const hasNoSelectedItemText
                        = selectedItemTextRef.current === null || !selectedItemTextRef.current.isConnected;
                if (selectedByFocus || (hasNoSelectedItemText && indexRef.current === 0)) {
                    selectedItemTextRef.current = node;
                }
            });
        },
        [selectedItemTextRef, indexRef, selectedByFocus]
    );

    const element = useRenderElement('div', componentProps, {
        ref: [localRef, ref, textRef],
        props: elementProps
    });

    return element;
}

export namespace SelectItemText {
    export type State = object;

    export type Props = HeadlessUIComponentProps<'div', State>;

}
