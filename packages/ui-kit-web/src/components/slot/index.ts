import { registerElements } from '~@lib/register';
import { PresentationElement } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
export class SlotElement extends PresentationElement {}
export const elements = SlotElement;
export function define(options: DefineOptions) {
    registerElements('slot', elements, options);
}
