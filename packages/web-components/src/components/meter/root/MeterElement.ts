import { MeterMachine } from '@flippo-software/core-components/meter';

import type { MeterOptions } from '@flippo-software/core-components/meter';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement, property } from '../../../lib/MachineElement';

import { MeterContext } from './MeterRootContext';

/**
 * A measurement within a known range (a disk usage, a score): the root of the `-meter-*` parts.
 *
 * Attributes: `value`, `min` (0), `max` (100), `locale`.
 * Properties: `format` (`Intl.NumberFormatOptions`), `getAriaValueText`.
 * State attributes (on all parts): `data-indeterminate`, `data-metering`, `data-complete`.
 */
export class MeterElement extends MachineElement.withAttributes({
    /** The current value. */
    value: 'number',
    /**
     * The minimum value
     * @default 0
     */
    min: 'number',
    /**
     * The maximum value
     * @default 100
     */
    max: 'number',
    /**
     * The locale used by `Intl.NumberFormat` when formatting the value.
     * Defaults to the user's runtime locale.
     */
    locale: 'string',
    /** Options to format the value. */
    format: property<Intl.NumberFormatOptions>(),
    /**
     * A function that returns a string value that provides a human-readable text alternative for `aria-valuenow`,
     * the current value of the meter.
     */
    getAriaValueText: property<MeterOptions['getAriaValueText']>()
}) {
    private meter!: MeterMachine;

    constructor() {
        super();
        declareProvider(this, MeterContext);
    }

    get machine(): MeterMachine {
        return this.meter;
    }

    protected override createParts() {
        this.meter = new MeterMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.meter.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return provideContext(this, MeterContext, this);
    }

    protected override getProps(): Props {
        return this.meter.getRootProps();
    }

    private getOptions(): MeterOptions {
        return {
            value: this.value ?? 0,
            min: this.min,
            max: this.max,
            locale: this.locale,
            format: this.format,
            getAriaValueText: this.getAriaValueText
        };
    }
}
