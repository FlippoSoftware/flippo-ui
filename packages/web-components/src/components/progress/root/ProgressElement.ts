import { ProgressMachine } from '@flippo-software/core-components/progress';
import { mergeProps } from '@flippo-software/core-components/props';

import type { ProgressOptions } from '@flippo-software/core-components/progress';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { MachineElement, property } from '../../../lib/MachineElement';

import { ProgressContext } from './ProgressRootContext';

/**
 * The status of a task that takes time: the root of the `-progress-*` parts.
 *
 * Attributes: `value` (absent: indeterminate), `min` (0), `max` (100), `locale`.
 * Properties: `format` (`Intl.NumberFormatOptions`), `getAriaValueText`.
 * State attributes (on all parts): `data-indeterminate`, `data-progressing`, `data-complete`.
 */
export class ProgressElement extends MachineElement.withAttributes({
    value: 'number',
    min: 'number',
    max: 'number',
    locale: 'string',
    format: property<Intl.NumberFormatOptions>(),
    getAriaValueText: property<ProgressOptions['getAriaValueText']>()
}) {
    private progress!: ProgressMachine;

    constructor() {
        super();
        declareProvider(this, ProgressContext);
    }

    get machine(): ProgressMachine {
        return this.progress;
    }

    protected override createParts() {
        this.progress = new ProgressMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.progress.setOptions(this.getOptions());
    }

    protected override connectParts() {
        return provideContext(this, ProgressContext, this);
    }

    protected override getProps(): Props {
        return mergeProps(this.progress.getRootProps(), ProgressMachine.attrs(this.progress.getState()));
    }

    private getOptions(): ProgressOptions {
        return {
            value: this.value ?? null,
            min: this.min,
            max: this.max,
            locale: this.locale,
            format: this.format,
            getAriaValueText: this.getAriaValueText
        };
    }
}
