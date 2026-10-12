import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { TooltipArrowElement } from './arrow/TooltipArrowElement';
import { TooltipPopupElement } from './popup/TooltipPopupElement';
import { TooltipPositionerElement } from './positioner/TooltipPositionerElement';
import { TooltipProviderElement } from './provider/TooltipProviderElement';
import { TooltipElement } from './root/TooltipElement';
import { TooltipTriggerElement } from './trigger/TooltipTriggerElement';

export * from './arrow/TooltipArrowElement';
export * from './popup/TooltipPopupElement';
export * from './positioner/TooltipPositionerElement';
export * from './provider/TooltipProviderElement';
export * from './root/TooltipElement';
export * from './root/TooltipRootContext';
export * from './trigger/TooltipTriggerElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    provider: TooltipProviderElement,
    root: TooltipElement,
    trigger: TooltipTriggerElement,
    positioner: TooltipPositionerElement,
    popup: TooltipPopupElement,
    arrow: TooltipArrowElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-tooltip…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('tooltip', elements, options);
}
