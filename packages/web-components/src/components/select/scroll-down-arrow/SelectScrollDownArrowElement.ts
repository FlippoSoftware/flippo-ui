import { SelectScrollArrowPart } from '../root/SelectRootContext';

/**
 * Scrolls the list down while hovered.
 *
 * Attributes: `keep-mounted`.
 * State attributes: `data-direction`, `data-visible`, `data-side`, transition attributes.
 */
export class SelectScrollDownArrowElement extends SelectScrollArrowPart {
    protected readonly direction = 'down';
}
