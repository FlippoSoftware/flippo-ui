'use client';

import { useRenderElement } from '@lib/hooks';

import type { HeadlessUIComponentProps } from '@lib/types';

import { useAccordionItemContext } from '../item/AccordionItemContext';
import { accordionStyleHookMapping } from '../item/styleHooks';

import type { AccordionItem } from '../item/AccordionItem';

/**
 * A heading that labels the corresponding panel.
 * Renders an `<h3>` element.
 *
 * Documentation: [Base UI Accordion](https://base-ui.com/react/components/accordion)
 */
export function AccordionHeader(componentProps: AccordionHeader.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { state } = useAccordionItemContext();

    const element = useRenderElement('h3', componentProps, {
        state,
        ref,
        props: elementProps,
        customStyleHookMapping: accordionStyleHookMapping
    });

    return element;
}

export namespace AccordionHeader {
    export type Props = HeadlessUIComponentProps<'h3', AccordionItem.State>;
}
