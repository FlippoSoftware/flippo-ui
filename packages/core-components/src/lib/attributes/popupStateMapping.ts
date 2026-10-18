import type { CustomStyleHookMapping } from './getStyleHookProps';

export enum CommonPopupDataAttributes {
    /**
     * Present when the popup is open.
     */
    open = 'data-open',
    /**
     * Present when the popup is closed.
     */
    closed = 'data-closed',
    /**
     * Present when the popup is animating in.
     */
    startingStyle = 'data-starting-style',
    /**
     * Present when the popup is animating out.
     */
    endingStyle = 'data-ending-style',
    /**
     * Present when the anchor is hidden.
     */
    anchorHidden = 'data-anchor-hidden'
}

export enum CommonTriggerDataAttributes {
    /**
     * Present when the popup of the trigger is open.
     */
    popupOpen = 'data-popup-open',
    /**
     * Present when the trigger is pressed.
     */
    pressed = 'data-pressed'
}

const TRIGGER_HOOK = {
    [CommonTriggerDataAttributes.popupOpen]: ''
};

const PRESSABLE_TRIGGER_HOOK = {
    [CommonTriggerDataAttributes.popupOpen]: '',
    [CommonTriggerDataAttributes.pressed]: ''
};

const POPUP_OPEN_HOOK = {
    [CommonPopupDataAttributes.open]: ''
};

const POPUP_CLOSED_HOOK = {
    [CommonPopupDataAttributes.closed]: ''
};

const ANCHOR_HIDDEN_HOOK = {
    [CommonPopupDataAttributes.anchorHidden]: ''
};

export const triggerOpenStateMapping = {
    open(value) {
        if (value) {
            return TRIGGER_HOOK;
        }
        return null;
    }
} satisfies CustomStyleHookMapping<{ open: boolean }>;

export const pressableTriggerOpenStateMapping = {
    open(value) {
        if (value) {
            return PRESSABLE_TRIGGER_HOOK;
        }
        return null;
    }
} satisfies CustomStyleHookMapping<{ open: boolean }>;

export const popupStateMapping = {
    open(value) {
        if (value) {
            return POPUP_OPEN_HOOK;
        }
        return POPUP_CLOSED_HOOK;
    },
    anchorHidden(value) {
        if (value) {
            return ANCHOR_HIDDEN_HOOK;
        }
        return null;
    }
} satisfies CustomStyleHookMapping<{ open: boolean; anchorHidden: boolean }>;
