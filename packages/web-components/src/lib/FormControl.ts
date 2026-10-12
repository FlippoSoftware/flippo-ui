import type { Props } from '@flippo-software/core-components/props';

import { PropsApplier } from './PropsApplier';

/**
 * The form side of a control element (checkbox, switch, radio…):
 *
 * - the hidden `<input>` the machines of the headless components work with (its change events, its validity), in
 *   the shadow root of the element, so that it never mixes with the page's markup;
 * - the participation of the element itself in forms, through `ElementInternals`: the element must be
 *   form-associated (`static formAssociated = true`), and submits under its `name` attribute.
 *
 * Without `attachInternals` (old browsers, test DOMs), the element works but does not submit a value.
 */
export class FormControl {
    /**
     * The hidden input (`null` for an element that submits values without one, like a slider).
     */
    readonly input: HTMLInputElement;

    readonly internals: ElementInternals | null;

    private readonly applier = new PropsApplier();

    /**
     * @param associated Whether the host takes part in forms (a radio does not: its group does).
     */
    constructor(host: HTMLElement, associated = true) {
        this.internals = associated && typeof host.attachInternals === 'function' ? host.attachInternals() : null;
        const document = host.ownerDocument;
        const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
        if (!root.querySelector('slot')) {
            root.append(document.createElement('slot'));
        }
        this.input = document.createElement('input');
        // Never shown: the machines only use its state and events.
        this.input.hidden = true;
        // The host forwards its clicks to the input (like a label): a click of the input must not reach the host again.
        this.input.addEventListener('click', (event) => event.stopPropagation());
        root.append(this.input);
    }

    /**
     * Applies the props of the hidden input.
     */
    applyInput(props: Props) {
        this.applier.apply(this.input, props);
    }

    /**
     * Submits `value` with the form (`null`: nothing), and reports the validity of the hidden input, with `anchor` as
     * the element the browser points at.
     */
    sync(value: string | FormData | null, anchor: HTMLElement | null) {
        const { internals, input } = this;
        if (!internals) {
            return;
        }
        internals.setFormValue(value);
        if (input.validity.valid) {
            internals.setValidity({});
        } else {
            internals.setValidity(input.validity, input.validationMessage || ' ', anchor ?? undefined);
        }
    }
}
