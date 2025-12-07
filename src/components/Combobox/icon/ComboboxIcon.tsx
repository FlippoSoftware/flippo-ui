import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

/**
 * An icon that indicates that the trigger button opens the popup.
 * Renders a `<span>` element.
 */
export function ComboboxIcon(componentProps: ComboboxIcon.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const element = useRenderElement('span', componentProps, {
        ref,
        props: [{
            'aria-hidden': true,
            'children': '▼'
        }, elementProps]
    });

    return element;
}

export type ComboboxIconState = {};

export type ComboboxIconProps = {} & HeadlessUIComponentProps<'span', ComboboxIcon.State>;

export namespace ComboboxIcon {
    export type State = ComboboxIconState;
    export type Props = ComboboxIconProps;
}
