import React from 'react';

import { useStore } from '@flippo-ui/hooks';
import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';

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

    const { store } = useSelectRootContext();
    const open = useStore(store, selectors.open);

    const state: SelectIcon.State = React.useMemo(
        () => ({
            open
        }),
        [open]
    );

    const element = useRenderElement('span', componentProps, {
        ref,
        state,
        props: [{
            'aria-hidden': true,
            'children': '▼'
        }, elementProps]
    });

    return element;
}

export namespace SelectIcon {
    export type State = {
        open: boolean;
    };

    export type Props = HeadlessUIComponentProps<'span', State>;
}
