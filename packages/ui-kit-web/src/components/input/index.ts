import { iconMarkup } from '@flippo-software/component-styles/icons';
import { input as recipe } from '@flippo-software/component-styles/input';
import { FieldControlElement } from '@flippo-software/web-components/field';

import { InputClearBaseElement } from '~@lib/InputClearElement';
import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const InputElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'input',
    'root',
    true,
    undefined,
    { focusControlOnPress: true }
);
export const InputControlElement: StyledConstructor<typeof FieldControlElement, typeof recipe> = styled(
    FieldControlElement,
    recipe,
    'input',
    'control',
    false
);
export const InputIconElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'input',
    'icon',
    false,
    undefined,
    { content: iconMarkup('magnifier') }
);
export const InputClearElement: StyledConstructor<typeof InputClearBaseElement, typeof recipe> = styled(
    InputClearBaseElement,
    recipe,
    'input',
    'clear',
    false,
    undefined,
    { content: iconMarkup('xmark') }
);
export const elements: {
    readonly root: typeof InputElement;
    readonly control: typeof InputControlElement;
    readonly icon: typeof InputIconElement;
    readonly clear: typeof InputClearElement;
} = { root: InputElement, control: InputControlElement, icon: InputIconElement, clear: InputClearElement } as const;
export function define(options: DefineOptions) {
    registerElements('input', elements, options);
}
export type InputElement = InstanceType<typeof InputElement>;
export type InputControlElement = InstanceType<typeof InputControlElement>;
export type InputIconElement = InstanceType<typeof InputIconElement>;
export type InputClearElement = InstanceType<typeof InputClearElement>;
