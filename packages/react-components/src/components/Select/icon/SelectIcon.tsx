import React from 'react';

import { SelectIcon as SelectIconCore } from '@flippo-software/core-components/select';

import { toReactProps, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectRoot } from '../root/SelectRootContext';

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

    const root = useSelectRoot();
    const track = useTracker();
    const { open } = track(() => SelectIconCore.getState(root));
    const state: SelectIcon.State = React.useMemo(() => ({ open }), [open]);

    return useRenderElement('span', componentProps, {
        state,
        ref,
        props: [elementProps, (props) => toReactProps(SelectIconCore.getProps(props))],
        customStyleHookMapping: triggerOpenStateMapping
    });
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
