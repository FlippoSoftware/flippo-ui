export enum SliderIndicatorDataAttributes {
    /**
     * Present while the user is dragging.
     */
    dragging = 'data-dragging',
    /**
     * Indicates the orientation of the slider.
     * @type {'horizontal' | 'vertical'}
     */
    orientation = 'data-orientation',
    /**
     * Present when the slider is disabled.
     */
    disabled = 'data-disabled',
    /**
     * Present when the slider is readonly.
     */
    readonly = 'data-readonly',
    /**
     * Present when the slider is required.
     */
    required = 'data-required',
    /**
     * Present when the slider is in valid state (inside a field).
     */
    valid = 'data-valid',
    /**
     * Present when the slider is in invalid state (inside a field).
     */
    invalid = 'data-invalid',
    /**
     * Present when the slider has been touched (inside a field).
     */
    touched = 'data-touched',
    /**
     * Present when the slider's value has changed (inside a field).
     */
    dirty = 'data-dirty',
    /**
     * Present when the slider is focused (inside a field).
     */
    focused = 'data-focused'
}
