import { CheckboxGroupMachine } from '@flippo-software/core-components/checkbox-group';
import { mergeProps } from '@flippo-software/core-components/props';
import { effect, untracked } from '@flippo-software/store';

import type { CheckboxGroupChangeEventDetails, CheckboxGroupOptions } from '@flippo-software/core-components/checkbox-group';
import type { Props } from '@flippo-software/core-components/props';

import { declareProvider, provideContext, requestAncestorContexts } from '../../../lib/context';
import { createId } from '../../../lib/createId';
import { MachineElement, property } from '../../../lib/MachineElement';
import { CheckboxGroupContext, type CheckboxGroupValueChangeDetail } from '../../checkbox/root/CheckboxRootContext';
import { FIELD_CONTROL_CONTEXTS } from '../../field/root/FieldRootContext';

import type { FieldElement } from '../../field/root/FieldElement';
import type { LabelableProvider } from '../../field/root/FieldRootContext';

/**
 * Checkboxes sharing one value: the values of the checked ones. A checkbox with `parent` checks or unchecks all of
 * `allValues`.
 *
 * Attributes: `disabled`.
 * Properties: `value` (controlled), `defaultValue`, `allValues` (arrays of the checkboxes' values).
 * Events: `value-change` (cancelable; `detail: { value, reason }`).
 * State attributes: `data-disabled`, and those of the field.
 */
export class CheckboxGroupElement extends MachineElement.withAttributes({
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled: 'boolean',
    /**
     * Names of the checkboxes in the group that should be ticked.
     *
     * To render an uncontrolled checkbox group, use the `defaultValue` attribute instead.
     */
    value: property<string[]>(),
    /**
     * Names of the checkboxes in the group that should be initially ticked.
     *
     * To render a controlled checkbox group, use the `value` attribute instead.
     */
    defaultValue: property<string[]>(),
    /** Names of all checkboxes in the group. Use this when creating a parent checkbox. */
    allValues: property<string[]>()
}) {
    private group!: CheckboxGroupMachine;

    private field: FieldElement | undefined;

    private labelableProvider: LabelableProvider | undefined;

    private cancelRequests: (() => void) | null = null;

    private readonly generatedId = createId('checkbox-group');

    private readonly parentId = createId('checkbox-group-parent');

    constructor() {
        super();
        declareProvider(this, CheckboxGroupContext);
    }

    get machine(): CheckboxGroupMachine {
        return this.group;
    }

    protected override whenReady(callback: () => void) {
        this.cancelRequests?.();
        this.cancelRequests = requestAncestorContexts(this, FIELD_CONTROL_CONTEXTS, ([field, labelable]) => {
            this.cancelRequests = null;
            this.field = field;
            this.labelableProvider = labelable;
            callback();
        });
    }

    override disconnectedCallback() {
        this.cancelRequests?.();
        this.cancelRequests = null;
        super.disconnectedCallback();
    }

    protected override createParts() {
        this.group = new CheckboxGroupMachine(this.getOptions());
    }

    protected override applyOptions() {
        this.group.setOptions(this.getOptions());
    }

    protected override afterOptions() {
        this.group.afterCommit();
    }

    protected override connectParts() {
        const disconnect = this.group.connect();
        const stopRegistering = effect(() => {
            this.group.value;
            return untracked(() => this.group.registerField());
        });
        const stopProviding = provideContext(this, CheckboxGroupContext, this);
        return () => {
            stopProviding();
            stopRegistering();
            disconnect();
        };
    }

    protected override getProps(): Props {
        return mergeProps(this.group.getRootProps(), CheckboxGroupMachine.attrs(this.group.getState()));
    }

    private getOptions(): CheckboxGroupOptions {
        return {
            value: this.value,
            defaultValue: this.defaultValue,
            allValues: this.allValues,
            disabled: this.disabled ?? false,
            field: this.field?.machine ?? null,
            labelable: this.labelableProvider?.labelable ?? null,
            id: this.targetId(this.generatedId),
            parentId: this.parentId,
            onValueChange: (value: string[], eventDetails: CheckboxGroupChangeEventDetails) => {
                this.emit('value-change', { value, reason: eventDetails.reason } satisfies CheckboxGroupValueChangeDetail, eventDetails);
            }
        };
    }
}
