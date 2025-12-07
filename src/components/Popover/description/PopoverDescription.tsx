import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePopoverRootContext } from '../root/PopoverRootContext';

/**
 * A paragraph with additional information about the popover.
 * Renders a `<p>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverDescription(componentProps: PopoverDescription.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { store } = usePopoverRootContext();

    const id = useHeadlessUiId(elementProps.id);

    useIsoLayoutEffect(() => {
        store.set('descriptionElementId', id);
        return () => {
            store.set('descriptionElementId', undefined);
        };
    }, [store, id]);

    const element = useRenderElement('p', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });

    return element;
}

export type PopoverDescriptionState = {};

export type PopoverDescriptionProps = {} & HeadlessUIComponentProps<'p', PopoverDescription.State>;

export namespace PopoverDescription {
    export type State = PopoverDescriptionState;
    export type Props = PopoverDescriptionProps;
}
