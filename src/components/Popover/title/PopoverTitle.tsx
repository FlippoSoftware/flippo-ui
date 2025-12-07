import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePopoverRootContext } from '../root/PopoverRootContext';

/**
 * A heading that labels the popover.
 * Renders an `<h2>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverTitle(componentProps: PopoverTitle.Props) {
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
        store.set('titleElementId', id);
        return () => {
            store.set('titleElementId', undefined);
        };
    }, [store, id]);

    const element = useRenderElement('h2', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });

    return element;
}

export type PopoverTitleState = {};

export type PopoverTitleProps = {} & HeadlessUIComponentProps<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', PopoverTitle.State>;

export namespace PopoverTitle {
    export type State = PopoverTitleState;
    export type Props = PopoverTitleProps;
}
