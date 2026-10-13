import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useValueAsRef } from '../useValueAsRef';

/**
 * Клавиши-действия, которые можно использовать в хоткеях.
 * Все в нижнем регистре для удобства сравнения.
 */
export const hotkeyAbleKeys = [
    // Буквы
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    // Цифры
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    // Функциональные
    'f1',
    'f2',
    'f3',
    'f4',
    'f5',
    'f6',
    'f7',
    'f8',
    'f9',
    'f10',
    'f11',
    'f12',
    // Навигация и управление
    'arrowup',
    'arrowdown',
    'arrowleft',
    'arrowright',
    'enter',
    'tab',
    'escape',
    'backspace',
    'delete',
    'insert',
    'home',
    'end',
    'pageup',
    'pagedown',
    // Пробел
    'space', // Псевдоним для ' '
    // Основные символы US-раскладки
    '`',
    '-',
    '=',
    '[',
    ']',
    '\\',
    ';',
    '\'',
    ',',
    '.',
    '/'
];

/**
 * Модификаторы, включая виртуальный 'mod'.
 */
export const modifierKeys = [
    'control',
    'alt',
    'shift',
    'meta',
    'mod'
];

export type HotkeyItem = [string, (event: KeyboardEvent) => void, HotkeyItemOptions?];

function shouldFireEvent(
    event: KeyboardEvent,
    tagsToIgnore: string[],
    triggerOnContentEditable = false
) {
    if (event.target instanceof HTMLElement) {
        if (triggerOnContentEditable) {
            return !tagsToIgnore.includes(event.target.tagName);
        }

        return !event.target.isContentEditable && !tagsToIgnore.includes(event.target.tagName);
    }

    return true;
}

export function useHotkeys(
    hotkeys: HotkeyItem[],
    tagsToIgnore: string[] = ['INPUT', 'TEXTAREA', 'SELECT'],
    triggerOnContentEditable = false
) {
    const hotkeysRef = useValueAsRef(hotkeys);
    const tagsToIgnoreRef = useValueAsRef(tagsToIgnore);
    const triggerOnContentEditableRef = useValueAsRef(triggerOnContentEditable);

    useIsoLayoutEffect(() => {
        const keydownListener = (event: KeyboardEvent) => {
            hotkeysRef.current.forEach(
                ([hotkey, handler, options = { preventDefault: true, usePhysicalKeys: false }]) => {
                    if (
                        getHotkeyMatcher(hotkey, options.usePhysicalKeys)(event)
                        && shouldFireEvent(event, tagsToIgnoreRef.current, triggerOnContentEditableRef.current)
                    ) {
                        if (options.preventDefault) {
                            event.preventDefault();
                        }

                        handler(event);
                    }
                }
            );
        };

        document.documentElement.addEventListener('keydown', keydownListener);
        return () => document.documentElement.removeEventListener('keydown', keydownListener);
    }, []);
}
export type KeyboardModifiers = {
    alt: boolean;
    ctrl: boolean;
    meta: boolean;
    mod: boolean;
    shift: boolean;
    plus: boolean;
};

export type Hotkey = KeyboardModifiers & {
    key?: string;
};

type CheckHotkeyMatch = (event: KeyboardEvent) => boolean;

const keyNameMap: Record<string, string> = {
    ' ': 'space',
    'ArrowLeft': 'arrowleft',
    'ArrowRight': 'arrowright',
    'ArrowUp': 'arrowup',
    'ArrowDown': 'arrowdown',
    'Escape': 'escape',
    'Esc': 'escape',
    'esc': 'escape',
    'Enter': 'enter',
    'Tab': 'tab',
    'Backspace': 'backspace',
    'Delete': 'delete',
    'Insert': 'insert',
    'Home': 'home',
    'End': 'end',
    'PageUp': 'pageup',
    'PageDown': 'pagedown',
    '+': 'plus',
    '-': 'minus',
    '*': 'asterisk',
    '/': 'slash'
};

function normalizeKey(key: string): string {
    const lowerKey = key.replace('Key', '').toLowerCase();
    return keyNameMap[key] || lowerKey;
}

export function parseHotkey(hotkey: string): Hotkey {
    const keys = hotkey
        .toLowerCase()
        .split('+')
        .map((part) => part.trim());

    const modifiers: KeyboardModifiers = {
        alt: keys.includes('alt'),
        ctrl: keys.includes('ctrl'),
        meta: keys.includes('meta'),
        mod: keys.includes('mod'),
        shift: keys.includes('shift'),
        plus: keys.includes('[plus]')
    };

    const reservedKeys = [
        'alt',
        'ctrl',
        'meta',
        'shift',
        'mod'
    ];

    const freeKey = keys.find((key) => !reservedKeys.includes(key));

    return {
        ...modifiers,
        key: freeKey === '[plus]' ? '+' : freeKey
    };
}

function isExactHotkey(hotkey: Hotkey, event: KeyboardEvent, usePhysicalKeys?: boolean): boolean {
    const {
        alt,
        ctrl,
        meta,
        mod,
        shift,
        key
    } = hotkey;
    const {
        altKey,
        ctrlKey,
        metaKey,
        shiftKey,
        key: pressedKey,
        code: pressedCode
    } = event;

    if (alt !== altKey) {
        return false;
    }

    if (mod) {
        if (!ctrlKey && !metaKey) {
            return false;
        }
    }
    else {
        if (ctrl !== ctrlKey) {
            return false;
        }
        if (meta !== metaKey) {
            return false;
        }
    }
    if (shift !== shiftKey) {
        return false;
    }

    if (
        key
        && (usePhysicalKeys
            ? normalizeKey(pressedCode) === normalizeKey(key)
            : normalizeKey(pressedKey ?? pressedCode) === normalizeKey(key))
    ) {
        return true;
    }

    return false;
}

export function getHotkeyMatcher(hotkey: string, usePhysicalKeys?: boolean): CheckHotkeyMatch {
    return (event) => isExactHotkey(parseHotkey(hotkey), event, usePhysicalKeys);
}

export type HotkeyItemOptions = {
    preventDefault?: boolean;
    usePhysicalKeys?: boolean;
};

export function getHotkeyHandler(hotkeys: HotkeyItem[]) {
    return (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
        const _event = 'nativeEvent' in event ? event.nativeEvent : event;
        hotkeys.forEach(
            ([hotkey, handler, options = { preventDefault: true, usePhysicalKeys: false }]) => {
                if (getHotkeyMatcher(hotkey, options.usePhysicalKeys)(_event)) {
                    if (options.preventDefault) {
                        event.preventDefault();
                    }

                    handler(_event);
                }
            }
        );
    };
}
