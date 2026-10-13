import { accordion as recipe } from '@flippo-software/component-styles/accordion';
import { iconMarkup } from '@flippo-software/component-styles/icons';
import * as Primitive from '@flippo-software/web-components/accordion';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const AccordionElement: StyledConstructor<typeof Primitive.AccordionElement, typeof recipe> = styled(
    Primitive.AccordionElement,
    recipe,
    'accordion',
    'root',
    true
);
export const AccordionItemElement: StyledConstructor<typeof Primitive.AccordionItemElement, typeof recipe> = styled(
    Primitive.AccordionItemElement,
    recipe,
    'accordion',
    'item',
    false
);
export const AccordionHeaderElement: StyledConstructor<typeof Primitive.AccordionHeaderElement, typeof recipe> = styled(
    Primitive.AccordionHeaderElement,
    recipe,
    'accordion',
    'header',
    false
);
export const AccordionTriggerElement: StyledConstructor<typeof Primitive.AccordionTriggerElement, typeof recipe> = styled(
    Primitive.AccordionTriggerElement,
    recipe,
    'accordion',
    'trigger',
    false
);
export const AccordionPanelElement: StyledConstructor<typeof Primitive.AccordionPanelElement, typeof recipe> = styled(
    Primitive.AccordionPanelElement,
    recipe,
    'accordion',
    'panel',
    false
);
export const AccordionIconElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'accordion',
    'icon',
    false,
    undefined,
    { content: iconMarkup('chevron-down') }
);
export const AccordionContentElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'accordion',
    'content'
);
export const elements: {
    readonly root: typeof AccordionElement;
    readonly item: typeof AccordionItemElement;
    readonly header: typeof AccordionHeaderElement;
    readonly trigger: typeof AccordionTriggerElement;
    readonly panel: typeof AccordionPanelElement;
    readonly icon: typeof AccordionIconElement;
    readonly content: typeof AccordionContentElement;
} = {
    root: AccordionElement,
    item: AccordionItemElement,
    header: AccordionHeaderElement,
    trigger: AccordionTriggerElement,
    panel: AccordionPanelElement,
    icon: AccordionIconElement,
    content: AccordionContentElement
} as const;
export function define(options: DefineOptions) {
    registerElements('accordion', elements, options);
}
export type AccordionElement = InstanceType<typeof AccordionElement>;
export type AccordionItemElement = InstanceType<typeof AccordionItemElement>;
export type AccordionHeaderElement = InstanceType<typeof AccordionHeaderElement>;
export type AccordionTriggerElement = InstanceType<typeof AccordionTriggerElement>;
export type AccordionPanelElement = InstanceType<typeof AccordionPanelElement>;
export type AccordionIconElement = InstanceType<typeof AccordionIconElement>;
export type AccordionContentElement = InstanceType<typeof AccordionContentElement>;
