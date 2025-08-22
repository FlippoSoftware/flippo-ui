'use client';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

/**
 * An icon that indicates that the trigger button opens a select menu.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectIcon(componentProps: SelectIcon.Props) {
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

export namespace SelectIcon {
    export type State = object;

    export type Props = HeadlessUIComponentProps<'span', State>;
}
