import { mergeProps } from '@flippo-software/core-components/props';
import { SliderMachine } from '@flippo-software/core-components/slider';
import { effect, untracked } from '@flippo-software/store';

import type { Props } from '@flippo-software/core-components/props';
import type {
    SliderChangeEventDetails,
    SliderCommitEventDetails,
    SliderOptions,
    SliderValue
} from '@flippo-software/core-components/slider';

import { declareProvider, provideContext } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { property } from '../../../lib/MachineElement';
import { ControlElement } from '../../field/utils/ControlElement';

import { SLIDER_WHITESPACE, SliderContext, type SliderValueChangeDetail, type SliderValueCommittedDetail } from './SliderRootContext';

/**
 * `"20"` → `20`, `"20 80"` → `[20, 80]` (a range).
 */
function parseSliderValue(value: string | undefined): SliderValue | undefined {
    const numbers = value?.split(SLIDER_WHITESPACE).filter(Boolean).map(Number);
    if (!numbers?.length || numbers.some(Number.isNaN)) {
        return undefined;
    }
    return numbers.length === 1 ? (numbers[0] as number) : numbers;
}

/**
 * A value (or a range, with two thumbs) chosen by dragging a thumb along a track: the root of the `-slider-*`
 * parts. It takes part in forms: it submits its values under `name`.
 *
 * Attributes: `default-value` (`"50"`, or `"20 80"` for a range), `min` (0), `max` (100), `step` (1), `large-step`
 * (10, with Page Up/Down and Shift), `min-steps-between-values`, `name`, `disabled`, `orientation` (`horizontal` by
 * default, `vertical`), `thumb-collision-behavior` (`push` by default, `swap`, `none`), `thumb-alignment` (`center`
 * by default, `edge`), `locale`.
 * Properties: `value` (controlled: a number, or an array for a range), `format` (`Intl.NumberFormatOptions`).
 * Events: `value-change` (cancelable; `detail: { value, reason, activeThumbIndex }`), `value-committed`
 * (`detail: { value, reason }`, when the pointer is released or a key changed the value).
 * State attributes: `data-dragging`, `data-orientation`, `data-disabled`, and those of the field.
 */
export class SliderElement extends ControlElement.withAttributes({
    /**
     * The uncontrolled value of the slider when it’s initially rendered.
     *
     * To render a controlled slider, use the `value` attribute instead.
     */
    'default-value': 'string',
    /**
     * The minimum allowed value of the slider.
     * Should not be equal to max.
     * @default 0
     */
    min: 'number',
    /**
     * The maximum allowed value of the slider.
     * Should not be equal to min.
     * @default 100
     */
    max: 'number',
    /**
     * The granularity with which the slider can step through values. (A "discrete" slider.)
     * The `min` attribute serves as the origin for the valid values.
     * We recommend (max - min) to be evenly divisible by the step.
     * @default 1
     */
    step: 'number',
    /**
     * The granularity with which the slider can step through values when using Page Up/Page Down or Shift + Arrow Up/Arrow Down.
     * @default 10
     */
    'large-step': 'number',
    /**
     * The minimum steps between values in a range slider.
     * @default 0
     */
    'min-steps-between-values': 'number',
    /** Identifies the field when a form is submitted. */
    name: 'string',
    /**
     * Whether the slider should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * The component orientation.
     * @default 'horizontal'
     */
    orientation: ['horizontal', 'vertical'],
    /**
     * Controls how thumbs behave when they collide during pointer interactions.
     *
     * - `'push'` (default): Thumbs push each other without restoring their previous positions when dragged back.
     * - `'swap'`: Thumbs swap places when dragged past each other.
     * - `'none'`: Thumbs cannot move past each other; excess movement is ignored.
     * @default 'push'
     */
    'thumb-collision-behavior': ['push', 'swap', 'none'],
    /**
     * How the thumb(s) are aligned relative to `<prefix>-slider-control` when the value is at `min` or `max`:
     * - `center`: The center of the thumb is aligned with the control edge
     * - `edge`: The thumb is inset within the control such that its edge is aligned with the control edge
     * @default 'center'
     */
    'thumb-alignment': ['center', 'edge'],
    /**
     * The locale used by `Intl.NumberFormat` when formatting the value.
     * Defaults to the user's runtime locale.
     */
    locale: 'string',
    /**
     * The value of the slider.
     * For ranged sliders, provide an array with two values.
     */
    value: property<SliderValue>(),
    /** Options to format the input value. */
    format: property<Intl.NumberFormatOptions>()
}) {
    private slider!: SliderMachine;

    private readonly generatedId = createId('slider');

    constructor() {
        super();
        declareProvider(this, SliderContext);
    }

    get machine(): SliderMachine {
        return this.slider;
    }

    protected override createParts() {
        this.slider = new SliderMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.slider.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.slider.afterCommit();
    }

    protected override connectParts() {
        const { slider, formControl } = this;
        const disconnect = slider.connect();
        const stopProviding = provideContext(this, SliderContext, this);
        // Registered again when the value changes: the registration holds it.
        const stopRegistering = effect(() => {
            slider.values;
            slider.name;
            return untracked(() => slider.registerField());
        });
        const stopSyncing = effect(() => {
            const { name, values } = slider;
            let formValue: FormData | null = null;
            if (name) {
                formValue = new FormData();
                for (const value of values) {
                    formValue.append(name, String(value));
                }
            }
            untracked(() => formControl.sync(formValue, this.target));
        });
        return () => {
            stopSyncing();
            stopRegistering();
            stopProviding();
            disconnect();
        };
    }

    protected override onTargetChange(element: HTMLElement | null) {
        this.slider?.setSliderElement(element);
    }

    protected override getProps(): Props {
        return mergeProps(this.slider.getRootProps(), SliderMachine.attrs(this.slider.getState()));
    }

    protected override resetValue() {
        if (this.value === undefined) {
            const value = parseSliderValue(this.defaultValue) ?? this.min ?? 0;
            this.slider.setValue(Array.isArray(value) ? [...value] : (value as number));
        }
    }

    private getOptions(): SliderOptions {
        return {
            id: this.targetId(this.generatedId),
            value: this.value,
            defaultValue: parseSliderValue(this.defaultValue),
            min: this.min ?? 0,
            max: this.max ?? 100,
            step: this.step ?? 1,
            largeStep: this.largeStep ?? 10,
            minStepsBetweenValues: this.minStepsBetweenValues ?? 0,
            name: this.name,
            disabled: (this.disabled ?? false) || this.formDisabled,
            orientation: this.orientation ?? 'horizontal',
            thumbCollisionBehavior: this.thumbCollisionBehavior ?? 'push',
            thumbAlignment: this.thumbAlignment ?? 'center',
            locale: this.locale,
            format: this.format,
            field: this.field?.machine ?? null,
            labelable: this.labelable,
            direction: this.closest('[dir]')?.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr',
            onValueChange: (value: number | number[], eventDetails: SliderChangeEventDetails) => {
                const detail: SliderValueChangeDetail = {
                    value,
                    reason: eventDetails.reason,
                    activeThumbIndex: eventDetails.activeThumbIndex
                };
                this.emit('value-change', detail, eventDetails);
            },
            onValueCommitted: (value: SliderValue, eventDetails: SliderCommitEventDetails) => {
                this.emit('value-committed', { value, reason: eventDetails.reason } satisfies SliderValueCommittedDetail);
            }
        };
    }
}
