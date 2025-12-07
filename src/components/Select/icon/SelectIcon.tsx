import React from 'react';

import { useStore } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { HeadlessUIComponentProps } from '~@lib/types';

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
        state,
        ref,
        props: [{ 'aria-hidden': true, 'children': '▼' }, elementProps],
        customStyleHookMapping: triggerOpenStateMapping
    });

    return element;
}

export type SelectIconState = {
    /**
     * Whether the select popup is currently open.
     */
    open: boolean;
};

export type SelectIconProps = {} & HeadlessUIComponentProps<'span', SelectIcon.State>;

export namespace SelectIcon {
    export type State = SelectIconState;
    export type Props = SelectIconProps;
}
