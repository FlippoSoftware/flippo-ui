import { collapsible as recipe } from '@flippo-software/component-styles/collapsible';
import { iconMarkup } from '@flippo-software/component-styles/icons';
import * as Primitive from '@flippo-software/web-components/collapsible';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const CollapsibleElement: StyledConstructor<typeof Primitive.CollapsibleElement, typeof recipe> = styled(
    Primitive.CollapsibleElement,
    recipe,
    'collapsible',
    'root',
    true
);
export const CollapsibleTriggerElement: StyledConstructor<typeof Primitive.CollapsibleTriggerElement, typeof recipe> = styled(
    Primitive.CollapsibleTriggerElement,
    recipe,
    'collapsible',
    'trigger',
    false
);
export const CollapsiblePanelElement: StyledConstructor<typeof Primitive.CollapsiblePanelElement, typeof recipe> = styled(
    Primitive.CollapsiblePanelElement,
    recipe,
    'collapsible',
    'panel',
    false
);
export const CollapsibleIconElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'collapsible',
    'icon',
    false,
    undefined,
    { content: iconMarkup('chevron-down') }
);
export const CollapsibleContentElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'collapsible',
    'content'
);
export const elements: {
    readonly root: typeof CollapsibleElement;
    readonly trigger: typeof CollapsibleTriggerElement;
    readonly panel: typeof CollapsiblePanelElement;
    readonly icon: typeof CollapsibleIconElement;
    readonly content: typeof CollapsibleContentElement;
} = {
    root: CollapsibleElement,
    trigger: CollapsibleTriggerElement,
    panel: CollapsiblePanelElement,
    icon: CollapsibleIconElement,
    content: CollapsibleContentElement
} as const;
export function define(options: DefineOptions) {
    registerElements('collapsible', elements, options);
}
export type CollapsibleElement = InstanceType<typeof CollapsibleElement>;
export type CollapsibleTriggerElement = InstanceType<typeof CollapsibleTriggerElement>;
export type CollapsiblePanelElement = InstanceType<typeof CollapsiblePanelElement>;
export type CollapsibleIconElement = InstanceType<typeof CollapsibleIconElement>;
export type CollapsibleContentElement = InstanceType<typeof CollapsibleContentElement>;
