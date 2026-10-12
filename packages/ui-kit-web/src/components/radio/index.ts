import { radio as recipe } from '@flippo-software/component-styles/radio';
import * as Primitive from '@flippo-software/web-components/radio';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const RadioElement: StyledConstructor<typeof Primitive.RadioElement, typeof recipe> = styled(
    Primitive.RadioElement,
    recipe,
    'radio',
    'root',
    true
);
export const RadioIndicatorElement: StyledConstructor<typeof Primitive.RadioIndicatorElement, typeof recipe> = styled(
    Primitive.RadioIndicatorElement,
    recipe,
    'radio',
    'indicator',
    false
);
export const RadioLabelElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'radio',
    'label'
);
export const elements: {
    readonly root: typeof RadioElement;
    readonly indicator: typeof RadioIndicatorElement;
    readonly label: typeof RadioLabelElement;
} = { root: RadioElement, indicator: RadioIndicatorElement, label: RadioLabelElement } as const;
export function define(options: DefineOptions) {
    registerElements('radio', elements, options);
}
export type RadioElement = InstanceType<typeof RadioElement>;
export type RadioIndicatorElement = InstanceType<typeof RadioIndicatorElement>;
export type RadioLabelElement = InstanceType<typeof RadioLabelElement>;
