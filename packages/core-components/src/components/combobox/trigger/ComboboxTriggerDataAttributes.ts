export enum ComboboxTriggerDataAttributes {
    /**
     * Present when the corresponding popup is open.
     */
    popupOpen = 'data-popup-open',
    /**
     * Present when the trigger is pressed.
     */
    pressed = 'data-pressed',
    /**
     * Present when the component is disabled.
     */
    disabled = 'data-disabled',
    /**
     * Present when the component is readonly.
     */
    readonly = 'data-readonly',
    /**
     * Present when the component is required.
     */
    required = 'data-required',
    /**
     * Present when the component is in valid state (inside a field).
     */
    valid = 'data-valid',
    /**
     * Present when the component is in invalid state (inside a field).
     */
    invalid = 'data-invalid',
    /**
     * Present when the component has been touched (inside a field).
     */
    touched = 'data-touched',
    /**
     * Present when the component's value has changed (inside a field).
     */
    dirty = 'data-dirty',
    /**
     * Present when the component has a value (inside a field).
     */
    filled = 'data-filled',
    /**
     * Present when the trigger is focused (inside a field).
     */
    focused = 'data-focused'
}
