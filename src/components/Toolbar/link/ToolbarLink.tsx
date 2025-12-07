

import React from 'react';

import type { HeadlessUIComponentProps, Orientation } from '~@lib/types';

import { CompositeItem } from '../../Composite/item/CompositeItem';
import { useToolbarRootContext } from '../root/ToolbarRootContext';

const TOOLBAR_LINK_METADATA = {
    // links cannot be disabled, this metadata is only used for deriving `disabledIndices``
    focusableWhenDisabled: true
};

/**
 * A link component.
 * Renders an `<a>` element.
 *
 * Documentation: [Base UI Toolbar](https://base-ui.com/react/components/toolbar)
 */
export function ToolbarLink(componentProps: ToolbarLink.Props) {
    const {
        className,
        render,
        ref,
        ...elementProps
    } = componentProps;

    const { orientation } = useToolbarRootContext();

    const state: ToolbarLink.State = React.useMemo(
        () => ({
            orientation
        }),
        [orientation]
    );

    return (
        <CompositeItem
          tag={'a'}
          render={render}
          className={className}
          metadata={TOOLBAR_LINK_METADATA}
          state={state}
          refs={[ref]}
          props={[elementProps]}
        />
    );
}

export namespace ToolbarLink {
    export type State = {
        orientation: Orientation;
    };

    export type Props = HeadlessUIComponentProps<'a', State>;
}
