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
    value: 'number',
    min: 'number',
    max: 'number',
    locale: 'string',
    format: property<Intl.NumberFormatOptions>(),
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
