import { EMPTY_OBJECT } from './constants';

import type { REASONS } from './reason';

type ReasonToEventMap = {
    [REASONS.none]: Event;

    [REASONS.triggerPress]: MouseEvent | PointerEvent | TouchEvent | KeyboardEvent;
    [REASONS.triggerHover]: MouseEvent;
    [REASONS.triggerFocus]: FocusEvent;

    [REASONS.outsidePress]: MouseEvent | PointerEvent | TouchEvent;
    [REASONS.itemPress]: MouseEvent | KeyboardEvent | PointerEvent;
    [REASONS.closePress]: MouseEvent | KeyboardEvent | PointerEvent;
    [REASONS.linkPress]: MouseEvent | PointerEvent;
    [REASONS.clearPress]: PointerEvent | MouseEvent | KeyboardEvent;
    [REASONS.chipRemovePress]: PointerEvent | MouseEvent | KeyboardEvent;
    [REASONS.trackPress]: PointerEvent | MouseEvent | TouchEvent;
    [REASONS.incrementPress]: PointerEvent | MouseEvent | TouchEvent;
    [REASONS.decrementPress]: PointerEvent | MouseEvent | TouchEvent;

    [REASONS.inputChange]: InputEvent | Event;
    [REASONS.inputClear]: InputEvent | FocusEvent | Event;
    [REASONS.inputBlur]: FocusEvent;
    [REASONS.inputPaste]: ClipboardEvent;

    [REASONS.focusOut]: FocusEvent | KeyboardEvent;
    [REASONS.escapeKey]: KeyboardEvent;
    [REASONS.listNavigation]: KeyboardEvent;
    [REASONS.keyboard]: KeyboardEvent;

    [REASONS.pointer]: PointerEvent;
    [REASONS.drag]: PointerEvent | TouchEvent;
    [REASONS.wheel]: WheelEvent;
    [REASONS.scrub]: PointerEvent;

    [REASONS.cancelOpen]: MouseEvent;
    [REASONS.siblingOpen]: Event;
    [REASONS.disabled]: Event;
    [REASONS.imperativeAction]: Event;

    [REASONS.windowResize]: UIEvent;
};

/**
 * Maps a change `reason` string to the corresponding native event type.
 */
export type ReasonToEvent<Reason extends string> = Reason extends keyof ReasonToEventMap
    ? ReasonToEventMap[Reason]
    : Event;

type HeadlessUIChangeEventDetail<Reason extends string, CustomProperties extends object> = {
    /**
     * The reason for the event.
     */
    reason: Reason;
    /**
     * The native event associated with the custom event.
     */
    event: ReasonToEvent<Reason>;
    /**
     * Cancels Base UI from handling the event.
     */
    cancel: () => void;
    /**
     * Allows the event to propagate in cases where Base UI will stop the propagation.
     */
    allowPropagation: () => void;
    /**
     * Indicates whether the event has been canceled.
     */
    isCanceled: boolean;
    /**
     * Indicates whether the event is allowed to propagate.
     */
    isPropagationAllowed: boolean;
    /**
     * The element that triggered the event, if applicable.
     */
    trigger: HTMLElement | undefined;
} & CustomProperties;

/**
 * Details of custom change events emitted by Base UI components.
 */
export type HeadlessUIChangeEventDetails<
    Reason extends string,
    CustomProperties extends object = {}
> = Reason extends string ? HeadlessUIChangeEventDetail<Reason, CustomProperties> : never;

/**
 * Details of custom generic events emitted by Base UI components.
 */
type HeadlessUIGenericEventDetail<Reason extends string, CustomProperties extends object> = {
    /**
     * The reason for the event.
     */
    reason: Reason;
    /**
     * The native event associated with the custom event.
     */
    event: ReasonToEvent<Reason>;
} & CustomProperties;

export type HeadlessUIGenericEventDetails<
    Reason extends string,
    CustomProperties extends object = {}
> = Reason extends string ? HeadlessUIGenericEventDetail<Reason, CustomProperties> : never;

/**
 * Creates a Base UI event details object with the given reason and utilities
 * for preventing Base UI's internal event handling.
 */
export function createChangeEventDetails<
    Reason extends string,
    CustomProperties extends object = {}
>(
    reason: Reason,
    event?: ReasonToEvent<Reason>,
    trigger?: HTMLElement,
    customProperties?: CustomProperties
): HeadlessUIChangeEventDetails<Reason, CustomProperties> {
    let canceled = false;
    let allowPropagation = false;
    const custom = customProperties ?? (EMPTY_OBJECT as CustomProperties);
    const details: HeadlessUIChangeEventDetail<Reason, CustomProperties> = {
        reason,
        event: (event ?? new Event('base-ui')) as ReasonToEvent<Reason>,
        cancel() {
            canceled = true;
        },
        allowPropagation() {
            allowPropagation = true;
        },
        get isCanceled() {
            return canceled;
        },
        get isPropagationAllowed() {
            return allowPropagation;
        },
        trigger,
        ...custom
    };
    return details as HeadlessUIChangeEventDetails<Reason, CustomProperties>;
}

export function createGenericEventDetails<
    Reason extends string,
    CustomProperties extends object = {}
>(
    reason: Reason,
    event?: ReasonToEvent<Reason>,
    customProperties?: CustomProperties
): HeadlessUIGenericEventDetails<Reason, CustomProperties> {
    const custom = customProperties ?? (EMPTY_OBJECT as CustomProperties);
    const details: HeadlessUIGenericEventDetail<Reason, CustomProperties> = {
        reason,
        event: (event ?? new Event('base-ui')) as ReasonToEvent<Reason>,
        ...custom
    };
    return details as HeadlessUIGenericEventDetails<Reason, CustomProperties>;
}
