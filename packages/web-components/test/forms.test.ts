import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { define } from '../src';

import { formEntries, stubElementInternals } from './stubElementInternals';

const tick = () => new Promise((resolve) => setTimeout(resolve));

const { internalsOf, restore } = stubElementInternals();

beforeAll(() => {
    globalThis.FLIPPO_UI_ANIMATIONS_DISABLED = true;
    define({ prefix: 'ui' });
});

afterAll(restore);

afterEach(() => {
    document.body.innerHTML = '';
});

async function mount(markup: string) {
    const container = document.createElement('div');
    container.innerHTML = markup;
    document.body.append(container);
    await tick();
    return (selector: string) => container.querySelector(selector) as HTMLElement;
}

const submitted = (element: Element) => formEntries(internalsOf(element)?.formValue);

describe('checkbox', () => {
    it('toggles, submits its value while checked, and shows its indicator', async () => {
        const query = await mount(`
            <ui-checkbox name="terms" value="yes"><ui-checkbox-indicator>✓</ui-checkbox-indicator></ui-checkbox>`);
        const checkbox = query('ui-checkbox');
        const indicator = query('ui-checkbox-indicator');
        expect(checkbox.getAttribute('role')).toBe('checkbox');
        expect(checkbox.getAttribute('aria-checked')).toBe('false');
        expect(indicator.hidden).toBe(true);
        // Like the headless component: `off` while unchecked.
        expect(submitted(checkbox)).toEqual([['terms', 'off']]);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        checkbox.addEventListener('checked-change', onChange);
        checkbox.click();
        await tick();
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ checked: true }));
        expect(checkbox.getAttribute('aria-checked')).toBe('true');
        expect(checkbox.hasAttribute('data-checked')).toBe(true);
        expect(indicator.hidden).toBe(false);
        expect(indicator.hasAttribute('data-checked')).toBe(true);
        expect(submitted(checkbox)).toEqual([['terms', 'yes']]);
    });

    it('reports required as invalid until checked, and resets with its form', async () => {
        const query = await mount('<ui-checkbox name="terms" required default-checked></ui-checkbox>');
        const checkbox = query('ui-checkbox') as HTMLElement & { formResetCallback(): void };
        expect(internalsOf(checkbox)?.valid).toBe(true);
        checkbox.click();
        await tick();
        expect(internalsOf(checkbox)?.valid).toBe(false);
        checkbox.formResetCallback();
        await tick();
        expect(checkbox.getAttribute('aria-checked')).toBe('true');
        expect(internalsOf(checkbox)?.valid).toBe(true);
    });

    it('cannot be changed while disabled', async () => {
        const query = await mount('<ui-checkbox disabled></ui-checkbox>');
        query('ui-checkbox').click();
        await tick();
        expect(query('ui-checkbox').getAttribute('aria-checked')).toBe('false');
        expect(query('ui-checkbox').hasAttribute('data-disabled')).toBe(true);
    });
});

describe('checkbox group', () => {
    it('shares the values of its checkboxes, and a parent checkbox checks all', async () => {
        const query = await mount(`
            <ui-checkbox-group>
                <ui-checkbox id="all" parent></ui-checkbox>
                <ui-checkbox id="a" value="a"></ui-checkbox>
                <ui-checkbox id="b" value="b"></ui-checkbox>
            </ui-checkbox-group>`);
        const group = query('ui-checkbox-group') as HTMLElement & { allValues?: string[]; value?: string[] };
        // A parent checkbox needs a controlled value, like the headless component.
        group.allValues = ['a', 'b'];
        group.value = [];
        await tick();
        const onChange = vi.fn((event: Event) => {
            group.value = (event as CustomEvent<{ value: string[] }>).detail.value;
            return (event as CustomEvent).detail;
        });
        group.addEventListener('value-change', onChange);

        query('#a').click();
        await tick();
        expect(onChange).toHaveLastReturnedWith(expect.objectContaining({ value: ['a'] }));
        expect(query('#all').getAttribute('aria-checked')).toBe('mixed');

        query('#all').click();
        await tick();
        expect(onChange).toHaveLastReturnedWith(expect.objectContaining({ value: ['a', 'b'] }));
        expect(query('#b').getAttribute('aria-checked')).toBe('true');
    });
});

describe('switch', () => {
    it('turns on and off, and submits `on`', async () => {
        const query = await mount('<ui-switch name="wifi"><ui-switch-thumb></ui-switch-thumb></ui-switch>');
        const control = query('ui-switch');
        expect(control.getAttribute('role')).toBe('switch');
        control.click();
        await tick();
        expect(control.getAttribute('aria-checked')).toBe('true');
        expect(query('ui-switch-thumb').hasAttribute('data-checked')).toBe(true);
        expect(submitted(control)).toEqual([['wifi', 'on']]);
    });
});

describe('radio group', () => {
    it('checks one radio and submits its value', async () => {
        const query = await mount(`
            <ui-radio-group name="size" default-value="s">
                <ui-radio id="s" value="s"><ui-radio-indicator></ui-radio-indicator></ui-radio>
                <ui-radio id="m" value="m"><ui-radio-indicator></ui-radio-indicator></ui-radio>
            </ui-radio-group>`);
        const group = query('ui-radio-group');
        expect(group.getAttribute('role')).toBe('radiogroup');
        expect(query('#s').getAttribute('aria-checked')).toBe('true');
        expect(submitted(group)).toEqual([['size', 's']]);

        const onChange = vi.fn((event: Event) => (event as CustomEvent).detail);
        group.addEventListener('value-change', onChange);
        query('#m').click();
        await tick();
        expect(onChange).toHaveReturnedWith(expect.objectContaining({ value: 'm' }));
        expect(query('#m').getAttribute('aria-checked')).toBe('true');
        expect(query('#s').getAttribute('aria-checked')).toBe('false');
        expect((query('#s ui-radio-indicator') as HTMLElement).hidden).toBe(true);
        expect((query('#m ui-radio-indicator') as HTMLElement).hidden).toBe(false);
        expect(submitted(group)).toEqual([['size', 'm']]);
    });

    it('moves the focus and the checked radio with the arrow keys', async () => {
        const query = await mount(`
            <ui-radio-group default-value="s">
                <ui-radio id="s" value="s"></ui-radio><ui-radio id="m" value="m"></ui-radio>
            </ui-radio-group>`);
        expect(query('#s').tabIndex).toBe(0);
        expect(query('#m').tabIndex).toBe(-1);
        query('#s').focus();
        query('#s').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await tick();
        expect(document.activeElement).toBe(query('#m'));
    });
});

describe('field', () => {
    it('labels and describes its control', async () => {
        const query = await mount(`
            <ui-field name="email">
                <ui-field-label as-child><label>Email</label></ui-field-label>
                <ui-field-control as-child><input type="email" /></ui-field-control>
                <ui-field-description>We never share it.</ui-field-description>
            </ui-field>`);
        const input = query('input');
        expect(query('label').getAttribute('for')).toBe(input.id);
        expect(input.getAttribute('name')).toBe('email');
        expect(input.getAttribute('aria-describedby')).toBe(query('ui-field-description').id);
    });

    it('validates on blur and shows the error', async () => {
        const query = await mount(`
            <ui-field validation-mode="onBlur">
                <ui-field-control as-child><input required /></ui-field-control>
                <ui-field-error></ui-field-error>
            </ui-field>`);
        const input = query('input') as HTMLInputElement;
        const error = query('ui-field-error');
        expect(error.hidden).toBe(true);
        input.focus();
        // An empty required field is only invalid once edited (like the headless component).
        for (const value of ['a', '']) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        input.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
        await tick();
        await tick();
        expect(query('ui-field').hasAttribute('data-invalid')).toBe(true);
        expect(error.hidden).toBe(false);
        expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('labels a checkbox: the label points at the checkbox itself', async () => {
        const query = await mount(`
            <ui-field>
                <ui-field-label>Subscribe</ui-field-label>
                <ui-checkbox></ui-checkbox>
            </ui-field>`);
        const checkbox = query('ui-checkbox');
        expect(query('ui-field-label').getAttribute('for')).toBe(checkbox.id);
        query('ui-field-label').click();
        await tick();
        expect(checkbox.getAttribute('aria-checked')).toBe('true');
    });
});

describe('fieldset', () => {
    it('is labelled by its legend and disables its fields', async () => {
        const query = await mount(`
            <ui-fieldset disabled>
                <ui-fieldset-legend>Address</ui-fieldset-legend>
                <ui-field><ui-field-control as-child><input /></ui-field-control></ui-field>
            </ui-fieldset>`);
        expect(query('ui-fieldset').getAttribute('aria-labelledby')).toBe(query('ui-fieldset-legend').id);
        expect(query('ui-field').hasAttribute('data-disabled')).toBe(true);
        expect((query('input') as HTMLInputElement).disabled).toBe(true);
    });
});

describe('form', () => {
    it('blocks an invalid submit and reports the values of a valid one', async () => {
        const query = await mount(`
            <ui-form as-child>
                <form>
                    <ui-field name="city">
                        <ui-field-control as-child><input required /></ui-field-control>
                        <ui-field-error></ui-field-error>
                    </ui-field>
                </form>
            </ui-form>`);
        const form = query('form') as HTMLFormElement;
        const onSubmit = vi.fn((event: Event) => (event as CustomEvent).detail);
        query('ui-form').addEventListener('form-submit', onSubmit);
        expect(form.noValidate).toBe(true);

        form.dispatchEvent(new SubmitEvent('submit', { cancelable: true, bubbles: true }));
        await tick();
        expect(onSubmit).not.toHaveBeenCalled();
        expect((query('ui-field-error') as HTMLElement).hidden).toBe(false);

        const input = query('input') as HTMLInputElement;
        input.value = 'Paris';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        form.dispatchEvent(new SubmitEvent('submit', { cancelable: true, bubbles: true }));
        await tick();
        expect(onSubmit).toHaveReturnedWith({ values: { city: 'Paris' } });
    });
});
