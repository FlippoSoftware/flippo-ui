import { describe, expect, it, vi } from 'vitest';

import { mergeProps } from './mergeProps';

import type { PreventableEvent } from './mergeProps';

/**
 * The shape of a React synthetic event that matters here (recognised by `nativeEvent`).
 */
function syntheticEvent() {
    return { nativeEvent: new MouseEvent('click'), type: 'click' } as { nativeEvent: MouseEvent; type: string } & Partial<PreventableEvent>;
}

describe('mergeProps', () => {
    it('runs the external handler first, then the internal one', () => {
        const order: string[] = [];
        const props = mergeProps({ onClick: () => order.push('ours') }, { onClick: () => order.push('theirs') });
        props.onClick(new MouseEvent('click'));
        expect(order).toEqual(['theirs', 'ours']);
    });

    it.each([
        ['a React synthetic event', syntheticEvent],
        ['a native event', () => new MouseEvent('click') as MouseEvent & Partial<PreventableEvent>]
    ])('lets the external handler prevent the internal one for %s', (_, createEvent) => {
        const ours = vi.fn();
        const props = mergeProps(
            { onClick: ours },
            {
                onClick: (event: PreventableEvent) => {
                    event.preventHeadlessUIHandler();
                }
            }
        );
        const event = createEvent();
        props.onClick(event);
        expect(ours).not.toHaveBeenCalled();
        expect(event).toHaveProperty('headlessUIHandlerPrevented', true);
    });

    it('passes non-event arguments through to both handlers', () => {
        const ours = vi.fn();
        const theirs = vi.fn();
        const props = mergeProps({ onValueChange: ours }, { onValueChange: theirs });
        props.onValueChange('next');
        expect(theirs).toHaveBeenCalledWith('next');
        expect(ours).toHaveBeenCalledWith('next');
    });

    it('merges class names and styles', () => {
        const props = mergeProps({ className: 'ours', style: { color: 'red', top: 0 } }, { className: 'theirs', style: { color: 'blue' } });
        expect(props.className).toBe('theirs ours');
        expect(props.style).toEqual({ color: 'blue', top: 0 });
    });
});
