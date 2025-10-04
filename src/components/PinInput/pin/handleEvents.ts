import { getEventKey, isComposingEvent } from '@lib/event';
import { ARABIC_RE, HAN_RE } from '@lib/parseNumeric';

import type { EventKeyMap } from '@lib/types';

import { testPattern } from '../utils/testPattern';

import type { PinInputFocusFunnel } from '../focus-funnel/PinInputFocusFunnel';

const NAVIGATE_KEYS = new Set(['Tab', 'Enter', 'Escape']);

/**
 * Check if a key press should be allowed through without intervention
 */
export function shouldAllowKey(event: React.KeyboardEvent): boolean {
    const isLatinNumeral = /^\d$/.test(event.key);
    const isArabicNumeral = ARABIC_RE.test(event.key);
    const isHanNumeral = HAN_RE.test(event.key);
    const isNavigateKey = NAVIGATE_KEYS.has(event.key);

    return (
        // Allow composition events (e.g., pinyin)
        // event.nativeEvent.isComposing does not work in Safari:
        // https://bugs.webkit.org/show_bug.cgi?id=165004
        isComposingEvent(event)
        || isLatinNumeral
        || isArabicNumeral
        || isHanNumeral
        || isNavigateKey
    );
}

/**
 * Handle special keys (Backspace, Delete, Enter)
 */
export function handleSpecialKeys(
    event: React.KeyboardEvent<HTMLInputElement>,
    context: {
        index: number;
        elementsRef: React.RefObject<(HTMLElement | null)[]>;
        onPinInputValueChange: (value: string, index: number, event: Event) => void;
        direction: 'ltr' | 'rtl';
        focusMode: PinInputFocusFunnel.FocusMode | undefined;
        values: string[];
    }
): void {
    const {
        index,
        elementsRef,
        onPinInputValueChange,
        direction,
        focusMode,
        values
    } = context;

    const keyMap: EventKeyMap = {
        Backspace() {
            onPinInputValueChange('', index, event.nativeEvent);

            // Move to previous input
            const prevIndex = Math.max(0, index - 1);
            const prevElement = elementsRef.current?.[prevIndex];
            if (prevElement) {
                prevElement.focus();
            }
        },
        Delete() {
            onPinInputValueChange('', index, event.nativeEvent);
        },
        Enter() {
            // Trigger value change to check completion logic without changing value
            const currentValue = values[index] ?? '';
            onPinInputValueChange(currentValue, index, event.nativeEvent);
        },
        ...(focusMode !== 'first-empty'
            ? {
                ArrowLeft() {
                    // Navigate to previous input
                    const prevIndex = Math.max(0, index - 1);
                    const prevElement = elementsRef.current?.[prevIndex];
                    if (prevElement && prevIndex !== index) {
                        prevElement.focus();
                    }
                },
                ArrowRight() {
                    // Navigate to next input
                    const nextIndex = Math.min(elementsRef.current?.length - 1 || 0, index + 1);
                    const nextElement = elementsRef.current?.[nextIndex];
                    if (nextElement && nextIndex !== index) {
                        nextElement.focus();
                    }
                },
                Home() {
                    // Focus first input
                    const firstElement = elementsRef.current?.[0];
                    if (firstElement) {
                        firstElement.focus();
                    }
                },
                End() {
                    // Focus last input
                    const lastIndex = (elementsRef.current?.length || 1) - 1;
                    const lastElement = elementsRef.current?.[lastIndex];
                    if (lastElement) {
                        lastElement.focus();
                    }
                }
            }
            : {})
    };

    const eventKey = getEventKey(event, {
        dir: direction,
        orientation: 'horizontal'
    });

    const handler = keyMap[eventKey];
    if (handler) {
        handler(event);
    }
}

/**
 * Handle paste operation for multiple characters
 */
export function handlePasteValue(
    pastedValue: string,
    startIndex: number,
    context: {
        elementsRef: React.RefObject<(HTMLElement | null)[]>;
        onPinInputValueChange: (value: string, index: number, event: Event) => void;
        setDirty: (dirty: boolean) => void;
        setFilled: (filled: boolean) => void;
        type?: 'alphanumeric' | 'numeric' | 'alphabetic';
        pattern?: string;
    }
): void {
    const {
        elementsRef,
        onPinInputValueChange,
        setDirty,
        setFilled,
        type,
        pattern
    } = context;

    // Filter and validate pasted characters
    const validChars = pastedValue
        .split('')
        .filter((char) => testPattern(char, type, pattern));

    if (validChars.length === 0) {
        return;
    }

    // Update field state
    setDirty(true);
    setFilled(true);

    // Distribute characters across available inputs
    const maxInputs = elementsRef.current?.length || 0;
    let focusIndex = startIndex;

    validChars.forEach((char, charIndex) => {
        const inputIndex = startIndex + charIndex;

        if (inputIndex < maxInputs) {
            // Create a synthetic event for consistency
            const syntheticEvent = new Event('input', { bubbles: true });
            onPinInputValueChange(char, inputIndex, syntheticEvent);
            focusIndex = inputIndex + 1;
        }
    });

    // Focus the next available input or the last one
    const nextFocusIndex = Math.min(focusIndex, maxInputs - 1);
    const elementToFocus = elementsRef.current?.[nextFocusIndex];
    if (elementToFocus) {
        elementToFocus.focus();
    }
}
