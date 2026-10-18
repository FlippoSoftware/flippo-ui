export enum ComboboxInputDataAttributes {
    /**
     * Present when the corresponding popup is open.
     */
    popupOpen = 'data-popup-open',
    /**
     * Present when the input is pressed.
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
     * Indicates which side the corresponding popup is positioned relative to its anchor.
     * @type {'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start' | null}
     */
    popupSide = 'data-popup-side',
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
     * Present when the input is focused (inside a field).
     */
    focused = 'data-focused',
    /**
     * Present when the corresponding items list is empty.
     */
    listEmpty = 'data-list-empty'
}
