import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

/**
 * Displays a status message whose content changes are announced politely to screen readers.
 * Useful for conveying the status of an asynchronously loaded list.
 * Renders a `<div>` element.
 */
export function ComboboxStatus(componentProps: ComboboxStatus.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    return useRenderElement('div', componentProps, {
        ref,
        props: [{
            'role': 'status',
            'aria-live': 'polite',
            'aria-atomic': true
        }, elementProps]
    });
}

export type ComboboxStatusState = {};

export type ComboboxStatusProps = {} & HeadlessUIComponentProps<'div', ComboboxStatus.State>;

export namespace ComboboxStatus {
    export type State = ComboboxStatusState;
    export type Props = ComboboxStatusProps;
}
