import React from 'react';

import { SelectList as SelectListCore } from '@flippo-software/core-components/select';

import { toReactProps, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useSelectRoot } from '../root/SelectRootContext';

/**
 * A container for the select items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectList(componentProps: SelectList.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const root = useSelectRoot();
    const track = useTracker();
    const { positioner } = useSelectPositionerContext();

    return useRenderElement('div', componentProps, {
        ref: [ref, root.setListElement],
        props: [elementProps, (props) => track(() => toReactProps(SelectListCore.getProps(root, positioner, props)))]
    });
}

export type SelectListProps = {} & HeadlessUIComponentProps<'div', SelectList.State>;

export type SelectListState = {};

export namespace SelectList {
    export type Props = SelectListProps;
    export type State = SelectListState;
}
