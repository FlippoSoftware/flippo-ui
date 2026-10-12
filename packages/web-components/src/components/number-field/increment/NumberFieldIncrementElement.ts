import { NumberFieldButtonPart } from '../root/NumberFieldRootContext';

/**
 * The button that increases the value.
 *
 * Attributes: `disabled`.
 */
export class NumberFieldIncrementElement extends NumberFieldButtonPart {
    protected readonly increment = true;
}
