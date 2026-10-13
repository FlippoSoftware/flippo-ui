import { textarea as recipe } from '@flippo-software/component-styles/textarea';
import { FieldControlElement } from '@flippo-software/web-components/field';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const TextareaElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'textarea',
    'root',
    true,
    undefined,
    { focusControlOnPress: true }
);
export const TextareaControlElement: StyledConstructor<typeof FieldControlElement, typeof recipe> = styled(
    FieldControlElement,
    recipe,
    'textarea',
    'control',
    false
);
export const TextareaIconElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'textarea',
    'icon',
    false
);
export const elements: {
    readonly root: typeof TextareaElement;
    readonly control: typeof TextareaControlElement;
    readonly icon: typeof TextareaIconElement;
} = { root: TextareaElement, control: TextareaControlElement, icon: TextareaIconElement } as const;
export function define(options: DefineOptions) {
    registerElements('textarea', elements, options);
}
export type TextareaElement = InstanceType<typeof TextareaElement>;
export type TextareaControlElement = InstanceType<typeof TextareaControlElement>;
export type TextareaIconElement = InstanceType<typeof TextareaIconElement>;
