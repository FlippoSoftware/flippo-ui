import { CommonCollapsibleTriggerDataAttributes } from '~@lib/collapsibleOpenStateMapping';

export enum CollapsibleTriggerDataAttributes {
    /**
     * Present when the accordion panel is open.
     */
    panelOpen = CommonCollapsibleTriggerDataAttributes.panelOpen,
    /**
     * Present when the accordion item is disabled.
     */
    disabled = 'data-disabled'
}
