import { drawer as recipe } from '@flippo-software/component-styles/drawer';
import { iconMarkup } from '@flippo-software/component-styles/icons';
import * as Primitive from '@flippo-software/web-components/drawer';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const DrawerElement: StyledConstructor<typeof Primitive.DrawerElement, typeof recipe> = styled(
    Primitive.DrawerElement,
    recipe,
    'drawer',
    'root',
    true
);
export const DrawerTriggerElement: StyledConstructor<typeof Primitive.elements.trigger, typeof recipe> = styled(
    Primitive.elements.trigger,
    recipe,
    'drawer',
    'trigger',
    false
);
export const DrawerBackdropElement: StyledConstructor<typeof Primitive.DrawerBackdropElement, typeof recipe> = styled(
    Primitive.DrawerBackdropElement,
    recipe,
    'drawer',
    'backdrop',
    false
);
export const DrawerPopupElement: StyledConstructor<typeof Primitive.DrawerPopupElement, typeof recipe> = styled(
    Primitive.DrawerPopupElement,
    recipe,
    'drawer',
    'popup',
    false
);
export const DrawerDragElement: StyledConstructor<typeof Primitive.DrawerDragElement, typeof recipe> = styled(
    Primitive.DrawerDragElement,
    recipe,
    'drawer',
    'drag',
    false
);
export const DrawerCloseElement: StyledConstructor<typeof Primitive.elements.close, typeof recipe> = styled(
    Primitive.elements.close,
    recipe,
    'drawer',
    'close',
    false,
    undefined,
    { bareAsChild: true, content: iconMarkup('xmark') }
);
export const DrawerTitleElement: StyledConstructor<typeof Primitive.elements.title, typeof recipe> = styled(
    Primitive.elements.title,
    recipe,
    'drawer',
    'title',
    false
);
export const DrawerDescriptionElement: StyledConstructor<typeof Primitive.elements.description, typeof recipe> = styled(
    Primitive.elements.description,
    recipe,
    'drawer',
    'description',
    false
);
export const DrawerActionsElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'drawer',
    'actions'
);
export const elements: {
    readonly root: typeof DrawerElement;
    readonly trigger: typeof DrawerTriggerElement;
    readonly backdrop: typeof DrawerBackdropElement;
    readonly popup: typeof DrawerPopupElement;
    readonly drag: typeof DrawerDragElement;
    readonly close: typeof DrawerCloseElement;
    readonly title: typeof DrawerTitleElement;
    readonly description: typeof DrawerDescriptionElement;
    readonly actions: typeof DrawerActionsElement;
} = {
    root: DrawerElement,
    trigger: DrawerTriggerElement,
    backdrop: DrawerBackdropElement,
    popup: DrawerPopupElement,
    drag: DrawerDragElement,
    close: DrawerCloseElement,
    title: DrawerTitleElement,
    description: DrawerDescriptionElement,
    actions: DrawerActionsElement
} as const;
export function define(options: DefineOptions) {
    registerElements('drawer', elements, options);
}
export type DrawerElement = InstanceType<typeof DrawerElement>;
export type DrawerTriggerElement = InstanceType<typeof DrawerTriggerElement>;
export type DrawerBackdropElement = InstanceType<typeof DrawerBackdropElement>;
export type DrawerPopupElement = InstanceType<typeof DrawerPopupElement>;
export type DrawerDragElement = InstanceType<typeof DrawerDragElement>;
export type DrawerCloseElement = InstanceType<typeof DrawerCloseElement>;
export type DrawerTitleElement = InstanceType<typeof DrawerTitleElement>;
export type DrawerDescriptionElement = InstanceType<typeof DrawerDescriptionElement>;
export type DrawerActionsElement = InstanceType<typeof DrawerActionsElement>;
