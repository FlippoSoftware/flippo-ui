import { clamp } from '~@lib/clamp';
import { valueToPercent } from '~@lib/valueToPercent';

export function valueArrayToPercentages(values: number[], min: number, max: number) {
    const output = [];

    for (const value of values) {
        output.push(clamp(valueToPercent(value, min, max), 0, 100));
    }

    return output;
}
