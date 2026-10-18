export enum TooltipTriggerDataAttributes {
    /**
     * Present when the tooltip is open.
     */
    popupOpen = 'data-popup-open',
    /**
     * Present when another tooltip of the same provider was open just before (the tooltips open instantly one after another).
     */
    multipleActive = 'data-multiple-active',
    /**
     * Present when the trigger is disabled.
     */
    triggerDisabled = 'data-trigger-disabled'
}
