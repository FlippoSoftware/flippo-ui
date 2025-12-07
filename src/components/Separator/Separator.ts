import React from 'react';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

export function Separator(componentProps: SeparatorProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        orientation = 'horizontal',
        ref,
        ...elementProps
    } = componentProps;

    const state: Separator.State = React.useMemo(() => ({ orientation }), [orientation]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{ 'role': 'separator', 'aria-orientation': orientation }, elementProps]
    });

    return element;
}

export type SeparatorProps = {
    /**
     * The orientation of the separator.
     * @default 'horizontal'
     */
    orientation?: Orientation;
} & HeadlessUIComponentProps<'div', Separator.State>;

export type SeparatorState = {
    /**
     * The orientation of the separator.
     */
    orientation: Orientation;
};

export namespace Separator {
    export type Props = SeparatorProps;
    export type State = SeparatorState;
}
