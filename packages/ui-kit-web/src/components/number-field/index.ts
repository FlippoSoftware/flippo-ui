import { iconMarkup } from '@flippo-software/component-styles/icons';
import { numberField as recipe } from '@flippo-software/component-styles/number-field';
import * as Primitive from '@flippo-software/web-components/number-field';

import { registerElements } from '../../lib/register';
import { styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const NumberFieldElement: StyledConstructor<typeof Primitive.NumberFieldElement, typeof recipe> = styled(
    Primitive.NumberFieldElement,
    recipe,
    'number-field',
    'root',
    true
);
export const NumberFieldGroupElement: StyledConstructor<typeof Primitive.NumberFieldGroupElement, typeof recipe> = styled(
    Primitive.NumberFieldGroupElement,
    recipe,
    'number-field',
    'group',
    false,
    undefined,
    { focusControlOnPress: true }
);
export const NumberFieldInputElement: StyledConstructor<typeof Primitive.NumberFieldInputElement, typeof recipe> = styled(
    Primitive.NumberFieldInputElement,
    recipe,
    'number-field',
    'input',
    false
);
export const NumberFieldIncrementElement: StyledConstructor<typeof Primitive.NumberFieldIncrementElement, typeof recipe> = styled(
    Primitive.NumberFieldIncrementElement,
    recipe,
    'number-field',
    'increment',
    false,
    undefined,
    { content: iconMarkup('plus') }
);
export const NumberFieldDecrementElement: StyledConstructor<typeof Primitive.NumberFieldDecrementElement, typeof recipe> = styled(
    Primitive.NumberFieldDecrementElement,
    recipe,
    'number-field',
    'decrement',
    false,
    undefined,
    { content: iconMarkup('minus') }
);
export const NumberFieldScrubAreaElement: StyledConstructor<typeof Primitive.NumberFieldScrubAreaElement, typeof recipe> = styled(
    Primitive.NumberFieldScrubAreaElement,
    recipe,
    'number-field',
    'scrubArea',
    false
);
export const NumberFieldScrubAreaCursorElement: StyledConstructor<typeof Primitive.NumberFieldScrubAreaCursorElement, typeof recipe> =
    styled(Primitive.NumberFieldScrubAreaCursorElement, recipe, 'number-field', 'scrubAreaCursor', false);
export const elements: {
    readonly root: typeof NumberFieldElement;
    readonly group: typeof NumberFieldGroupElement;
    readonly input: typeof NumberFieldInputElement;
    readonly increment: typeof NumberFieldIncrementElement;
    readonly decrement: typeof NumberFieldDecrementElement;
    readonly scrubArea: typeof NumberFieldScrubAreaElement;
    readonly scrubAreaCursor: typeof NumberFieldScrubAreaCursorElement;
} = {
    root: NumberFieldElement,
    group: NumberFieldGroupElement,
    input: NumberFieldInputElement,
    increment: NumberFieldIncrementElement,
    decrement: NumberFieldDecrementElement,
    scrubArea: NumberFieldScrubAreaElement,
    scrubAreaCursor: NumberFieldScrubAreaCursorElement
} as const;
export function define(options: DefineOptions) {
    registerElements('number-field', elements, options);
}
export type NumberFieldElement = InstanceType<typeof NumberFieldElement>;
export type NumberFieldGroupElement = InstanceType<typeof NumberFieldGroupElement>;
export type NumberFieldInputElement = InstanceType<typeof NumberFieldInputElement>;
export type NumberFieldIncrementElement = InstanceType<typeof NumberFieldIncrementElement>;
export type NumberFieldDecrementElement = InstanceType<typeof NumberFieldDecrementElement>;
export type NumberFieldScrubAreaElement = InstanceType<typeof NumberFieldScrubAreaElement>;
export type NumberFieldScrubAreaCursorElement = InstanceType<typeof NumberFieldScrubAreaCursorElement>;
