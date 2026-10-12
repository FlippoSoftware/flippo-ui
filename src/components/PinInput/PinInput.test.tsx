import React from 'react';

import { createRenderer, screen } from '@flippo/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { Field } from '../Field';
import { Form } from '../Form';

import { PinInput } from '.';

describe.each(RENDER_MODES)('PinInput ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestPin(props: Partial<PinInput.Root.Props>) {
        return (
            <PinInput.Root data-testid='root' {...(props as PinInput.Root.Props)}>
                <PinInput.Group>
                    <PinInput.Pin />
                    <PinInput.Pin />
                    <PinInput.Pin />
                </PinInput.Group>
            </PinInput.Root>
        );
    }

    const pin = (index: number) => screen.getByLabelText(`PIN digit ${index + 1}`);

    it('fills the pins while typing and moves focus forward', async () => {
        const onValueChange = vi.fn();
        const onValueComplete = vi.fn();
        const { user } = render(<TestPin onValueChange={onValueChange} onValueComplete={onValueComplete} />);
        await user.click(pin(0));
        await user.keyboard('123');
        expect(pin(0)).toHaveValue('1');
        expect(pin(1)).toHaveValue('2');
        expect(pin(2)).toHaveValue('3');
        expect(onValueChange).toHaveBeenLastCalledWith('123', ['1', '2', '3'], expect.anything());
        expect(onValueComplete).toHaveBeenCalledWith('123', ['1', '2', '3'], expect.anything());
    });

    it('rejects characters that do not match the type', async () => {
        const { user } = render(<TestPin />);
        await user.click(pin(0));
        await user.keyboard('a');
        expect(pin(0)).toHaveValue('');
        expect(pin(0)).toHaveFocus();
    });

    it('moves back and clears with Backspace', async () => {
        const { user } = render(<TestPin defaultValue='12' />);
        expect(pin(1)).toHaveValue('2');
        await user.click(pin(1));
        await user.keyboard('[Backspace]');
        expect(pin(1)).toHaveValue('');
    });

    it('fills from a paste', async () => {
        const { user } = render(<TestPin />);
        await user.click(pin(0));
        await user.paste('987');
        expect(pin(0)).toHaveValue('9');
        expect(pin(2)).toHaveValue('7');
    });

    it('masks the values and ignores a disabled input', async () => {
        const { user, rerender } = render(<TestPin mask={true} defaultValue='1' />);
        expect(pin(0)).toHaveAttribute('type', 'password');
        // The uncontrolled value is kept; a disabled input ignores typing.
        rerender(<TestPin disabled={true} />);
        expect(pin(0)).toBeDisabled();
        await user.click(pin(0));
        await user.keyboard('5');
        expect(pin(0)).toHaveValue('1');
    });

    it('submits the code with a form', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='code'>
                    <TestPin />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        await user.click(pin(0));
        await user.keyboard('456');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onFormSubmit).toHaveBeenCalledWith({ code: '456' }, expect.anything());
    });
});
