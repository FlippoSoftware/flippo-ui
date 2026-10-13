import { iconMarkup } from '@flippo-software/component-styles/icons';
import { toast as recipe } from '@flippo-software/component-styles/toast';
import * as Primitive from '@flippo-software/web-components/toast';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const ToastProviderElement: StyledConstructor<typeof Primitive.ToastProviderElement, typeof recipe> = styled(
    Primitive.ToastProviderElement,
    recipe,
    'toast',
    'provider',
    false
);
export const ToastViewportElement: StyledConstructor<typeof Primitive.ToastViewportElement, typeof recipe> = styled(
    Primitive.ToastViewportElement,
    recipe,
    'toast',
    'viewport',
    false
);
export const ToastElement: StyledConstructor<typeof Primitive.ToastElement, typeof recipe> = styled(
    Primitive.ToastElement,
    recipe,
    'toast',
    'root',
    true
);
export const ToastTitleElement: StyledConstructor<typeof Primitive.ToastTitleElement, typeof recipe> = styled(
    Primitive.ToastTitleElement,
    recipe,
    'toast',
    'title',
    false
);
export const ToastDescriptionElement: StyledConstructor<typeof Primitive.ToastDescriptionElement, typeof recipe> = styled(
    Primitive.ToastDescriptionElement,
    recipe,
    'toast',
    'description',
    false
);
export const ToastActionElement: StyledConstructor<typeof Primitive.ToastActionElement, typeof recipe> = styled(
    Primitive.ToastActionElement,
    recipe,
    'toast',
    'action',
    false
);
export const ToastCloseElement: StyledConstructor<typeof Primitive.ToastCloseElement, typeof recipe> = styled(
    Primitive.ToastCloseElement,
    recipe,
    'toast',
    'close',
    false,
    undefined,
    { content: iconMarkup('xmark') }
);
export const ToastIconElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'toast',
    'icon'
);
export const ToastTimerElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'toast',
    'timer'
);
export const ToastContentElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'toast',
    'content'
);
export const elements: {
    readonly provider: typeof ToastProviderElement;
    readonly viewport: typeof ToastViewportElement;
    readonly root: typeof ToastElement;
    readonly title: typeof ToastTitleElement;
    readonly description: typeof ToastDescriptionElement;
    readonly action: typeof ToastActionElement;
    readonly close: typeof ToastCloseElement;
    readonly icon: typeof ToastIconElement;
    readonly timer: typeof ToastTimerElement;
    readonly content: typeof ToastContentElement;
} = {
    provider: ToastProviderElement,
    viewport: ToastViewportElement,
    root: ToastElement,
    title: ToastTitleElement,
    description: ToastDescriptionElement,
    action: ToastActionElement,
    close: ToastCloseElement,
    icon: ToastIconElement,
    timer: ToastTimerElement,
    content: ToastContentElement
} as const;
export function define(options: DefineOptions) {
    registerElements('toast', elements, options);
}
export type ToastProviderElement = InstanceType<typeof ToastProviderElement>;
export type ToastViewportElement = InstanceType<typeof ToastViewportElement>;
export type ToastElement = InstanceType<typeof ToastElement>;
export type ToastTitleElement = InstanceType<typeof ToastTitleElement>;
export type ToastDescriptionElement = InstanceType<typeof ToastDescriptionElement>;
export type ToastActionElement = InstanceType<typeof ToastActionElement>;
export type ToastCloseElement = InstanceType<typeof ToastCloseElement>;
export type ToastIconElement = InstanceType<typeof ToastIconElement>;
export type ToastTimerElement = InstanceType<typeof ToastTimerElement>;
export type ToastContentElement = InstanceType<typeof ToastContentElement>;
