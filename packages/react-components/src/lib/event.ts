import type React from 'react';

import type { NativeEvent } from './types';

export function isComposingEvent(event: React.KeyboardEvent) {
    return event.which === 229 || getNativeEvent(event).isComposing;
}

export function getNativeEvent<E>(event: E): NativeEvent<E> {
    return (event as any).nativeEvent ?? event;
}

export type EventKeyOptions = {
    dir?: 'ltr' | 'rtl' | undefined;
    orientation?: 'horizontal' | 'vertical' | undefined;
};

const keyMap: Record<string, string> = {
    'Up': 'ArrowUp',
    'Down': 'ArrowDown',
    'Esc': 'Escape',
    ' ': 'Space',
    ',': 'Comma',
    'Left': 'ArrowLeft',
    'Right': 'ArrowRight'
};

const rtlKeyMap: Record<string, string> = {
    ArrowLeft: 'ArrowRight',
    ArrowRight: 'ArrowLeft'
};

export function getEventKey(event: Pick<KeyboardEvent, 'key'>, options: EventKeyOptions = {}) {
    const { dir = 'ltr', orientation = 'horizontal' } = options;
    let key = event.key;
    key = keyMap[key] ?? key;
    const isRtl = dir === 'rtl' && orientation === 'horizontal';
    if (isRtl && key in rtlKeyMap)
        key = rtlKeyMap[key] ?? key;
    return key;
}
