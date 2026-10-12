import { familyRoot } from './styled';

/**
 * The anchor of a combobox popup: the whole input group (the field's box) rather than the input inside it, so the
 * popup is as wide as the field and aligned with it. Falls back to the input when there is no group.
 */
export function inputGroupAnchor(family: string): (element: HTMLElement) => () => Element | null {
    return (element) => () => familyRoot(element, family)?.querySelector('.fl-combobox-input-group') ?? null;
}
