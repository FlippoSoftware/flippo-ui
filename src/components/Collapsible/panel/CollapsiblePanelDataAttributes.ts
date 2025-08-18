import { TransitionStatusDataAttributes } from '@lib/styleHookMapping';

export enum CollapsiblePanelDataAttributes {
    /**
     * Indicates the orientation of the tabs.
     * @type { 'horizontal' | 'vertical' }
     */
    orientation = 'data-orientation',
    /**
     * Present when the tab is disabled.
     */
    disabled = 'data-disabled',
    /**
     * Present when the collapsible panel is open.
     */
    open = 'data-open',
    /**
     * Present when the collapsible panel is closed.
     */
    closed = 'data-closed',
    /**
     * Present when the panel is animating in.
     */
    startingStyle = TransitionStatusDataAttributes.startingStyle,
    /**
     * Present when the panel is animating out.
     */
    endingStyle = TransitionStatusDataAttributes.endingStyle
}
