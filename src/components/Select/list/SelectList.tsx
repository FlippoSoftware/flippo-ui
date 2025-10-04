import { useEventCallback, useStore } from '@flippo-ui/hooks';
import { useRenderElement } from '@lib/hooks/';
import { styleDisableScrollbar } from '@lib/styles';

import type { HeadlessUIComponentProps, HTMLProps } from '@lib/types';

import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';
import { LIST_FUNCTIONAL_STYLES } from '../utils/clearStyles';

/**
 * A container for the select items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectList(componentProps: SelectList.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { store, scrollHandlerRef } = useSelectRootContext();
    const { alignItemWithTriggerActive } = useSelectPositionerContext();

    const hasScrollArrows = useStore(store, selectors.hasScrollArrows);
    const touchModality = useStore(store, selectors.touchModality);
    const multiple = useStore(store, selectors.multiple);
    const id = useStore(store, selectors.id);

    const defaultProps: HTMLProps = {
        'id': `${id}-list`,
        'role': 'listbox',
        'aria-multiselectable': multiple || undefined,
        onScroll(event) {
            scrollHandlerRef.current?.(event.currentTarget);
        },
        ...(alignItemWithTriggerActive && {
            style: LIST_FUNCTIONAL_STYLES
        }),
        'className': hasScrollArrows && !touchModality ? styleDisableScrollbar.className : undefined
    };

    const setListElement = useEventCallback((element: HTMLElement | null) => {
        store.set('listElement', element);
    });

    return useRenderElement('div', componentProps, {
        ref: [ref, setListElement],
        props: [defaultProps, elementProps]
    });
}

export namespace SelectList {
    export type State = object;

    export type Props = HeadlessUIComponentProps<'div', State>;

}
