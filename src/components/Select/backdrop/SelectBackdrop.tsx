import React from 'react';

import { useStore } from '@flippo-ui/hooks';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { TransitionStatus } from '@flippo-ui/hooks';
import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';

const customStyleHookMapping: StateAttributesMapping<SelectBackdrop.State> = {
    ...popupStateMapping,
    ...transitionStatusMapping
};

/**
 * An overlay displayed beneath the menu popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectBackdrop(componentProps: SelectBackdrop.Props) {
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
    const mounted = useStore(store, selectors.mounted);
    const transitionStatus = useStore(store, selectors.transitionStatus);

    const state: SelectBackdrop.State = React.useMemo(
        () => ({
            open,
            transitionStatus
        }),
        [open, transitionStatus]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref,
        props: [{
            role: 'presentation',
            hidden: !mounted,
            style: {
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }
        }, elementProps],
        customStyleHookMapping
    });

    return element;
}

export namespace SelectBackdrop {
    export type State = {
        /**
         * Whether the select menu is currently open.
         */
        open: boolean;
        transitionStatus: TransitionStatus;
    };

    export type Props = HeadlessUIComponentProps<'div', State>;
}
