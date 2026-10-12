import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { Field } from '../Field';
import { Form } from '../Form';

import { NumberField } from '.';

describe.each(RENDER_MODES)('NumberField ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestField(props: Partial<NumberField.Root.Props>) {
        return (
            <NumberField.Root data-testid='root' {...(props as NumberField.Root.Props)}>
                <NumberField.Group>
                    <NumberField.Decrement aria-label='Decrease' />
                    <NumberField.Input aria-label='Amount' />
                    <NumberField.Increment aria-label='Increase' />
                </NumberField.Group>
            </NumberField.Root>
        );
    }

    const input = () => screen.getByRole('textbox', { name: 'Amount' });

    it('shows the formatted default value', () => {
        render(<TestField defaultValue={1500} />);
        expect(input()).toHaveValue('1,500');
    });

    it('commits typed values on blur', async () => {
        const onValueChange = vi.fn();
        const onValueCommitted = vi.fn();
        const { user } = render(<TestField onValueChange={onValueChange} onValueCommitted={onValueCommitted} />);
        await user.click(input());
        await user.keyboard('42');
        await user.tab();
        expect(onValueChange).toHaveBeenLastCalledWith(42, expect.anything());
        expect(onValueCommitted).toHaveBeenLastCalledWith(42, expect.anything());
        expect(input()).toHaveValue('42');
    });

    it('steps with the arrow keys', async () => {
        const { user } = render(<TestField defaultValue={5} step={2} largeStep={10} />);
        await user.click(input());
        await user.keyboard('[ArrowUp]');
        expect(input()).toHaveValue('7');
        await user.keyboard('[ArrowDown][ArrowDown]');
        expect(input()).toHaveValue('3');
        await user.keyboard('{Shift>}[ArrowUp]{/Shift}');
        expect(input()).toHaveValue('13');
    });

    it('steps with the buttons within min and max', async () => {
        const { user } = render(<TestField defaultValue={9} min={0} max={10} />);
        await user.click(screen.getByRole('button', { name: 'Increase' }));
        expect(input()).toHaveValue('10');
        expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
        await user.click(screen.getByRole('button', { name: 'Decrease' }));
        expect(input()).toHaveValue('9');
    });

    it('follows the controlled value', async () => {
        const onValueChange = vi.fn();
        const { user, rerender } = render(<TestField value={1} onValueChange={onValueChange} />);
        await user.click(screen.getByRole('button', { name: 'Increase' }));
        expect(onValueChange).toHaveBeenCalledWith(2, expect.anything());
        expect(input()).toHaveValue('1');
        rerender(<TestField value={5} onValueChange={onValueChange} />);
        expect(input()).toHaveValue('5');
    });

    it('ignores interaction when disabled or read-only', async () => {
        const { user, rerender } = render(<TestField defaultValue={1} disabled={true} />);
        expect(input()).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
        expect(screen.getByTestId('root')).toHaveAttribute('data-disabled', '');

        rerender(<TestField defaultValue={1} readOnly={true} />);
        expect(input()).toHaveAttribute('readonly');
        await user.click(screen.getByRole('button', { name: 'Increase' }));
        expect(input()).toHaveValue('1');
    });

    it('submits its value with a form', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='amount'>
                    <TestField defaultValue={3} />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        await user.click(screen.getByRole('button', { name: 'Increase' }));
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onFormSubmit).toHaveBeenCalledWith({ amount: 4 }, expect.anything());
    });
});
