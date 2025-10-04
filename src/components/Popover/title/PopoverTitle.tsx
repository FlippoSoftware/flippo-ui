'use client';

import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import { useHeadlessUiId, useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

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
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { setTitleId } = usePopoverRootContext();

    const id = useHeadlessUiId(elementProps.id);

    useIsoLayoutEffect(() => {
        setTitleId(id);
        return () => {
            setTitleId(undefined);
        };
    }, [setTitleId, id]);

    const element = useRenderElement('h2', componentProps, {
        ref,
        props: [{ id }, elementProps]
    });

    return element;
}

export namespace PopoverTitle {
    export type State = object;

    export type Props = HeadlessUIComponentProps<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', State>;
}
