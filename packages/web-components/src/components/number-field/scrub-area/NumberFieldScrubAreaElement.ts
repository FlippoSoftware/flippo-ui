import { NumberFieldScrubAreaMachine } from '@flippo-software/core-components/number-field';
import { mergeProps } from '@flippo-software/core-components/props';

import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext } from '../../../lib/context';
import { NumberFieldPart, NumberFieldScrubAreaContext } from '../root/NumberFieldRootContext';

/**
 * An area (e.g. around the label) that changes the value when the pointer is dragged over it.
 *
 * Attributes: `direction` (`horizontal` by default, `vertical`), `pixel-sensitivity` (2), `teleport-distance`.
 */
export class NumberFieldScrubAreaElement extends NumberFieldPart.withAttributes({
    direction: ['horizontal', 'vertical'],
    'pixel-sensitivity': 'number',
    'teleport-distance': 'number'
}) {
    private scrubArea!: NumberFieldScrubAreaMachine;

    constructor() {
        super();
        declareProvider(this, NumberFieldScrubAreaContext);
    }

    get machine(): NumberFieldScrubAreaMachine {
        return this.scrubArea;
    }

    protected override createParts() {
        this.scrubArea = new NumberFieldScrubAreaMachine(this.numberField, this.getOptions());
    }

    protected override applyOptions() {
        this.scrubArea.setOptions(this.getOptions());
    }

    protected override connectParts() {
        const disconnect = this.scrubArea.connect();
        const stopProviding = provideContext(this, NumberFieldScrubAreaContext, this);
        return () => {
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.scrubArea?.setScrubArea(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.scrubArea.getProps(), this.stateAttributes);
    }

    private getOptions() {
        return {
            direction: this.direction ?? 'horizontal',
            pixelSensitivity: this.pixelSensitivity ?? 2,
            teleportDistance: this.teleportDistance
        };
    }
}
