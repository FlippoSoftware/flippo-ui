import { NumberFieldButtonPart } from '../root/NumberFieldRootContext';

/**
 * The button that decreases the value.
 *
 * Attributes: `disabled`.
 */
export class NumberFieldDecrementElement extends NumberFieldButtonPart {
    protected readonly increment = false;
}
