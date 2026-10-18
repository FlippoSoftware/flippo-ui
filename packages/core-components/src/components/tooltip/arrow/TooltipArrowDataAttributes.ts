export enum TooltipArrowDataAttributes {
    /**
     * Present when the tooltip is open.
     */
    open = 'data-open',
    /**
     * Present when the tooltip is closed.
     */
    closed = 'data-closed',
    /**
     * Present when the anchor is hidden.
     */
    anchorHidden = 'data-anchor-hidden',
    /**
     * Indicates which side the tooltip is positioned relative to the trigger.
     * @type {'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'}
     */
    side = 'data-side',
    /**
     * Indicates how the tooltip is aligned relative to specified side.
     * @type {'start' | 'center' | 'end'}
     */
    align = 'data-align',
    /**
     * Present when the arrow cannot be centered on the trigger.
     */
    uncentered = 'data-uncentered',
    /**
     * Present when another tooltip of the same provider was open just before (the tooltips open instantly one after another).
     */
    multipleActive = 'data-multiple-active'
}
