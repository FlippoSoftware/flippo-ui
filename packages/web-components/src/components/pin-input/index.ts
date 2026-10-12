import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { PinInputFocusFunnelElement } from './focus-funnel/PinInputFocusFunnelElement';
import { PinInputGroupElement } from './group/PinInputGroupElement';
import { PinInputPinElement } from './pin/PinInputPinElement';
import { PinInputElement } from './root/PinInputElement';

export * from './focus-funnel/PinInputFocusFunnelElement';
export * from './group/PinInputGroupElement';
export * from './pin/PinInputPinElement';
export * from './root/PinInputElement';
export * from './root/PinInputRootContext';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: PinInputElement,
    group: PinInputGroupElement,
    focusFunnel: PinInputFocusFunnelElement,
    pin: PinInputPinElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-pin-input…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('pinInput', elements, options);
}
