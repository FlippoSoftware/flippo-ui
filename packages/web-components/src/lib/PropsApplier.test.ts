import { describe, expect, it, vi } from 'vitest';

import { PropsApplier } from './PropsApplier';

describe('PropsApplier', () => {
    it('renders attributes like React', () => {
        const element = document.createElement('div');
        new PropsApplier().apply(element, {
            role: 'button',
            tabIndex: 0,
            'aria-expanded': false,
            'data-open': '',
            hidden: false,
            disabled: true,
            id: undefined
        });
        expect(element.getAttribute('role')).toBe('button');
        expect(element.getAttribute('tabindex')).toBe('0');
        expect(element.getAttribute('aria-expanded')).toBe('false');
        expect(element.getAttribute('data-open')).toBe('');
        expect(element.hasAttribute('hidden')).toBe(false);
        expect(element.getAttribute('disabled')).toBe('');
        expect(element.hasAttribute('id')).toBe(false);
    });

    it('removes what it applied before and no longer applies', () => {
        const element = document.createElement('div');
        element.setAttribute('title', 'page');
        element.classList.add('page');
        const applier = new PropsApplier();
        const onClick = vi.fn();

        applier.apply(element, { 'data-open': '', className: 'a b', style: { color: 'red', '--size': '4px' }, onClick });
        applier.apply(element, { className: 'b', style: { color: 'blue' } });

        expect(element.hasAttribute('data-open')).toBe(false);
        expect([...element.classList]).toEqual(['page', 'b']);
        expect(element.style.color).toBe('blue');
        expect(element.style.getPropertyValue('--size')).toBe('');
        element.click();
        expect(onClick).not.toHaveBeenCalled();
        // Attributes of the page are kept.
        expect(element.getAttribute('title')).toBe('page');
    });

    it('maps React events to DOM events and swaps handlers without re-adding listeners', () => {
        const element = document.createElement('div');
        const applier = new PropsApplier();
        const first = vi.fn();
        const second = vi.fn();
        const add = vi.spyOn(element, 'addEventListener');

        applier.apply(element, { onFocus: first, onKeyDownCapture: first });
        applier.apply(element, { onFocus: second, onKeyDownCapture: second });
        expect(add.mock.calls.map(([type, , capture]) => [type, capture])).toEqual([
            ['focusin', false],
            ['keydown', true]
        ]);

        element.dispatchEvent(new FocusEvent('focusin'));
        element.dispatchEvent(new KeyboardEvent('keydown'));
        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledTimes(2);
    });

    it('adds px to numbers like React', () => {
        const element = document.createElement('div');
        new PropsApplier().apply(element, { style: { width: 10, opacity: 0.5, marginTop: 0 } });
        expect(element.style.width).toBe('10px');
        expect(element.style.opacity).toBe('0.5');
        expect(element.style.marginTop).toMatch(/^0(px)?$/);
    });

    it('never writes attributes the element owns', () => {
        const element = document.createElement('div');
        element.setAttribute('disabled', '');
        new PropsApplier((name) => name === 'disabled').apply(element, { disabled: false, 'aria-disabled': true });
        expect(element.getAttribute('disabled')).toBe('');
        expect(element.getAttribute('aria-disabled')).toBe('true');
    });
});
