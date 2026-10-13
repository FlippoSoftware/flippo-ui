import { pinInput as recipe } from '@flippo-software/component-styles/pin-input';
import * as Primitive from '@flippo-software/web-components/pin-input';

import { registerElements } from '~@lib/register';
import { styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const PinInputElement: StyledConstructor<typeof Primitive.PinInputElement, typeof recipe> = styled(
    Primitive.PinInputElement,
    recipe,
    'pin-input',
    'root',
    true,
    undefined,
    { defaults: { placeholder: '' } }
);
export const PinInputGroupElement: StyledConstructor<typeof Primitive.PinInputGroupElement, typeof recipe> = styled(
    Primitive.PinInputGroupElement,
    recipe,
    'pin-input',
    'group',
    false
);
export const PinInputFocusFunnelElement: StyledConstructor<typeof Primitive.PinInputFocusFunnelElement, typeof recipe> = styled(
    Primitive.PinInputFocusFunnelElement,
    recipe,
    'pin-input',
    'focusFunnel',
    false
);
export const PinInputPinElement: StyledConstructor<typeof Primitive.PinInputPinElement, typeof recipe> = styled(
    Primitive.PinInputPinElement,
    recipe,
    'pin-input',
    'pin',
    false
);
export const elements: {
    readonly root: typeof PinInputElement;
    readonly group: typeof PinInputGroupElement;
    readonly focusFunnel: typeof PinInputFocusFunnelElement;
    readonly pin: typeof PinInputPinElement;
} = { root: PinInputElement, group: PinInputGroupElement, focusFunnel: PinInputFocusFunnelElement, pin: PinInputPinElement } as const;
export function define(options: DefineOptions) {
    registerElements('pin-input', elements, options);
}
export type PinInputElement = InstanceType<typeof PinInputElement>;
export type PinInputGroupElement = InstanceType<typeof PinInputGroupElement>;
export type PinInputFocusFunnelElement = InstanceType<typeof PinInputFocusFunnelElement>;
export type PinInputPinElement = InstanceType<typeof PinInputPinElement>;
