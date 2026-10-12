import { SelectScrollArrowPart } from '../root/SelectRootContext';

/**
 * Scrolls the list up while hovered.
 *
 * Attributes: `keep-mounted`.
 * State attributes: `data-direction`, `data-visible`, `data-side`, transition attributes.
 */
export class SelectScrollUpArrowElement extends SelectScrollArrowPart {
    protected readonly direction = 'up';
}
