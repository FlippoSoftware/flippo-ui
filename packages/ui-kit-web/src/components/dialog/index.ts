import { dialog as recipe } from '@flippo-software/component-styles/dialog';
import { iconMarkup } from '@flippo-software/component-styles/icons';
import * as Primitive from '@flippo-software/web-components/dialog';

import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const DialogElement: StyledConstructor<typeof Primitive.DialogElement, typeof recipe> = styled(
    Primitive.DialogElement,
    recipe,
    'dialog',
    'root',
    true
);
export const DialogTriggerElement: StyledConstructor<typeof Primitive.DialogTriggerElement, typeof recipe> = styled(
    Primitive.DialogTriggerElement,
    recipe,
    'dialog',
    'trigger',
    false
);
export const DialogBackdropElement: StyledConstructor<typeof Primitive.DialogBackdropElement, typeof recipe> = styled(
    Primitive.DialogBackdropElement,
    recipe,
    'dialog',
    'backdrop',
    false
);
export const DialogPopupElement: StyledConstructor<typeof Primitive.DialogPopupElement, typeof recipe> = styled(
    Primitive.DialogPopupElement,
    recipe,
    'dialog',
    'popup',
    false
);
export const DialogCloseElement: StyledConstructor<typeof Primitive.DialogCloseElement, typeof recipe> = styled(
    Primitive.DialogCloseElement,
    recipe,
    'dialog',
    'close',
    false,
    undefined,
    { bareAsChild: true, content: iconMarkup('xmark') }
);
export const DialogTitleElement: StyledConstructor<typeof Primitive.DialogTitleElement, typeof recipe> = styled(
    Primitive.DialogTitleElement,
    recipe,
    'dialog',
    'title',
    false
);
export const DialogDescriptionElement: StyledConstructor<typeof Primitive.DialogDescriptionElement, typeof recipe> = styled(
    Primitive.DialogDescriptionElement,
    recipe,
    'dialog',
    'description',
    false
);
export const DialogActionsElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'dialog',
    'actions'
);
export const elements: {
    readonly root: typeof DialogElement;
    readonly trigger: typeof DialogTriggerElement;
    readonly backdrop: typeof DialogBackdropElement;
    readonly popup: typeof DialogPopupElement;
    readonly close: typeof DialogCloseElement;
    readonly title: typeof DialogTitleElement;
    readonly description: typeof DialogDescriptionElement;
    readonly actions: typeof DialogActionsElement;
} = {
    root: DialogElement,
    trigger: DialogTriggerElement,
    backdrop: DialogBackdropElement,
    popup: DialogPopupElement,
    close: DialogCloseElement,
    title: DialogTitleElement,
    description: DialogDescriptionElement,
    actions: DialogActionsElement
} as const;
export function define(options: DefineOptions) {
    registerElements('dialog', elements, options);
}
export type DialogElement = InstanceType<typeof DialogElement>;
export type DialogTriggerElement = InstanceType<typeof DialogTriggerElement>;
export type DialogBackdropElement = InstanceType<typeof DialogBackdropElement>;
export type DialogPopupElement = InstanceType<typeof DialogPopupElement>;
export type DialogCloseElement = InstanceType<typeof DialogCloseElement>;
export type DialogTitleElement = InstanceType<typeof DialogTitleElement>;
export type DialogDescriptionElement = InstanceType<typeof DialogDescriptionElement>;
export type DialogActionsElement = InstanceType<typeof DialogActionsElement>;
