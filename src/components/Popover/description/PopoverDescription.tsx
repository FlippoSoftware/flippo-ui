'use client';

import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

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
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { setDescriptionId } = usePopoverRootContext();

    const id = useHeadlessUiId(elementProps.id);

    useIsoLayoutEffect(() => {
        setDescriptionId(id);
        return () => {
            setDescriptionId(undefined);
        };
    }, [setDescriptionId, id]);

    const element = useRenderElement('p', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });

    return element;
}

export namespace PopoverDescription {
    export type State = object;

    export type Props = HeadlessUIComponentProps<'p', State>;
}
