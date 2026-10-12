import { tooltip as recipe } from '@flippo-software/component-styles/tooltip';
import * as Primitive from '@flippo-software/web-components/tooltip';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const TooltipProviderElement: StyledConstructor<typeof Primitive.TooltipProviderElement, typeof recipe> = styled(
    Primitive.TooltipProviderElement,
    recipe,
    'tooltip',
    'provider',
    false
);
export const TooltipElement: StyledConstructor<typeof Primitive.TooltipElement, typeof recipe> = styled(
    Primitive.TooltipElement,
    recipe,
    'tooltip',
    'root',
    true
);
export const TooltipTriggerElement: StyledConstructor<typeof Primitive.TooltipTriggerElement, typeof recipe> = styled(
    Primitive.TooltipTriggerElement,
    recipe,
    'tooltip',
    'trigger',
    false
);
export const TooltipPositionerElement: StyledConstructor<typeof Primitive.TooltipPositionerElement, typeof recipe> = styled(
    Primitive.TooltipPositionerElement,
    recipe,
    'tooltip',
    'positioner',
    false,
    undefined,
    { defaults: { sideOffset: 10 } }
);
export const TooltipPopupElement: StyledConstructor<typeof Primitive.TooltipPopupElement, typeof recipe> = styled(
    Primitive.TooltipPopupElement,
    recipe,
    'tooltip',
    'popup',
    false
);
export const TooltipArrowElement: StyledConstructor<typeof Primitive.TooltipArrowElement, typeof recipe> = styled(
    Primitive.TooltipArrowElement,
    recipe,
    'tooltip',
    'arrow',
    false
);
export const elements: {
    readonly provider: typeof TooltipProviderElement;
    readonly root: typeof TooltipElement;
    readonly trigger: typeof TooltipTriggerElement;
    readonly positioner: typeof TooltipPositionerElement;
    readonly popup: typeof TooltipPopupElement;
    readonly arrow: typeof TooltipArrowElement;
} = {
    provider: TooltipProviderElement,
    root: TooltipElement,
    trigger: TooltipTriggerElement,
    positioner: TooltipPositionerElement,
    popup: TooltipPopupElement,
    arrow: TooltipArrowElement
} as const;
export function define(options: DefineOptions) {
    registerElements('tooltip', elements, options);
}
export type TooltipProviderElement = InstanceType<typeof TooltipProviderElement>;
export type TooltipElement = InstanceType<typeof TooltipElement>;
export type TooltipTriggerElement = InstanceType<typeof TooltipTriggerElement>;
export type TooltipPositionerElement = InstanceType<typeof TooltipPositionerElement>;
export type TooltipPopupElement = InstanceType<typeof TooltipPopupElement>;
export type TooltipArrowElement = InstanceType<typeof TooltipArrowElement>;
