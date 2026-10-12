import { field as recipe } from '@flippo-software/component-styles/field';
import * as Primitive from '@flippo-software/web-components/field';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const FieldElement: StyledConstructor<typeof Primitive.FieldElement, typeof recipe> = styled(
    Primitive.FieldElement,
    recipe,
    'field',
    'root',
    true
);
export const FieldItemElement: StyledConstructor<typeof Primitive.FieldItemElement, typeof recipe> = styled(
    Primitive.FieldItemElement,
    recipe,
    'field',
    'item',
    false
);
export const FieldLabelElement: StyledConstructor<typeof Primitive.FieldLabelElement, typeof recipe> = styled(
    Primitive.FieldLabelElement,
    recipe,
    'field',
    'label',
    false
);
export const FieldControlElement: StyledConstructor<typeof Primitive.FieldControlElement, typeof recipe> = styled(
    Primitive.FieldControlElement,
    recipe,
    'field',
    'control',
    false
);
export const FieldDescriptionElement: StyledConstructor<typeof Primitive.FieldDescriptionElement, typeof recipe> = styled(
    Primitive.FieldDescriptionElement,
    recipe,
    'field',
    'description',
    false
);
export const FieldErrorElement: StyledConstructor<typeof Primitive.FieldErrorElement, typeof recipe> = styled(
    Primitive.FieldErrorElement,
    recipe,
    'field',
    'error',
    false
);
export const elements: {
    readonly root: typeof FieldElement;
    readonly item: typeof FieldItemElement;
    readonly label: typeof FieldLabelElement;
    readonly control: typeof FieldControlElement;
    readonly description: typeof FieldDescriptionElement;
    readonly error: typeof FieldErrorElement;
} = {
    root: FieldElement,
    item: FieldItemElement,
    label: FieldLabelElement,
    control: FieldControlElement,
    description: FieldDescriptionElement,
    error: FieldErrorElement
} as const;
export function define(options: DefineOptions) {
    registerElements('field', elements, options);
}
export type FieldElement = InstanceType<typeof FieldElement>;
export type FieldItemElement = InstanceType<typeof FieldItemElement>;
export type FieldLabelElement = InstanceType<typeof FieldLabelElement>;
export type FieldControlElement = InstanceType<typeof FieldControlElement>;
export type FieldDescriptionElement = InstanceType<typeof FieldDescriptionElement>;
export type FieldErrorElement = InstanceType<typeof FieldErrorElement>;
