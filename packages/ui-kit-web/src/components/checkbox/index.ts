import { checkbox as recipe } from '@flippo-software/component-styles/checkbox';
import * as Primitive from '@flippo-software/web-components/checkbox';

import { CHECK_MARKUP } from '~@lib/icons';
import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const CheckboxElement: StyledConstructor<typeof Primitive.CheckboxElement, typeof recipe> = styled(
    Primitive.CheckboxElement,
    recipe,
    'checkbox',
    'root',
    true
);
export const CheckboxIndicatorElement: StyledConstructor<typeof Primitive.CheckboxIndicatorElement, typeof recipe> = styled(
    Primitive.CheckboxIndicatorElement,
    recipe,
    'checkbox',
    'indicator',
    false,
    undefined,
    { content: CHECK_MARKUP }
);
export const CheckboxLabelElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'checkbox',
    'label'
);
export const elements: {
    readonly root: typeof CheckboxElement;
    readonly indicator: typeof CheckboxIndicatorElement;
    readonly label: typeof CheckboxLabelElement;
} = { root: CheckboxElement, indicator: CheckboxIndicatorElement, label: CheckboxLabelElement } as const;
export function define(options: DefineOptions) {
    registerElements('checkbox', elements, options);
}
export type CheckboxElement = InstanceType<typeof CheckboxElement>;
export type CheckboxIndicatorElement = InstanceType<typeof CheckboxIndicatorElement>;
export type CheckboxLabelElement = InstanceType<typeof CheckboxLabelElement>;
