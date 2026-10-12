import React from 'react';

import { act, createRenderer, fireEvent, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { Fieldset } from '../Fieldset';
import { Form } from '../Form';
import { Input } from '../Input';

import { Field } from '.';

describe.each(RENDER_MODES)('Field ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    it('labels and describes the control', () => {
        render(
            <Field.Root data-testid='root'>
                <Field.Label>Email</Field.Label>
                <Field.Control control='input'>
                    <Field.Control.Slot />
                </Field.Control>
                <Field.Description>We never share it</Field.Description>
            </Field.Root>
        );
        const control = screen.getByRole('textbox', { name: 'Email' });
        const description = screen.getByText('We never share it');
        expect(control).toHaveAttribute('aria-describedby', description.id);
        expect(screen.getByText('Email')).toHaveAttribute('for', control.id);
    });

    it('validates required values on blur in onBlur mode and shows the error', async () => {
        const { user } = render(
            <Field.Root validationMode='onBlur' data-testid='root'>
                <Field.Control control='input' required={true}>
                    <Field.Control.Slot />
                </Field.Control>
                <Field.Error data-testid='error'>Required</Field.Error>
            </Field.Root>
        );
        const control = screen.getByRole('textbox');
        expect(screen.queryByTestId('error')).toBeNull();

        // `required` only invalidates a value the user changed.
        await user.type(control, 'a');
        await user.clear(control);
        await user.tab();
        expect(control).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByTestId('error')).toHaveTextContent('Required');
        expect(control.getAttribute('aria-describedby')).toContain(screen.getByTestId('error').id);
        expect(screen.getByTestId('root')).toHaveAttribute('data-invalid', '');
        expect(screen.getByTestId('root')).toHaveAttribute('data-touched', '');

        await user.type(control, 'a');
        await user.tab();
        expect(control).not.toHaveAttribute('aria-invalid');
        expect(screen.getByTestId('root')).toHaveAttribute('data-valid', '');
        expect(screen.getByTestId('root')).toHaveAttribute('data-dirty', '');
        expect(screen.getByTestId('root')).toHaveAttribute('data-filled', '');
    });

    it('runs custom validation on change in onChange mode', async () => {
        const { user } = render(
            <Field.Root validationMode='onChange' validate={(value) => (value === 'admin' ? 'Taken' : null)}>
                <Field.Control control='input'>
                    <Field.Control.Slot />
                </Field.Control>
                <Field.Error data-testid='error' />
            </Field.Root>
        );
        await user.type(screen.getByRole('textbox'), 'admin');
        expect(screen.getByTestId('error')).toHaveTextContent('Taken');
        await user.type(screen.getByRole('textbox'), '2');
        expect(screen.queryByTestId('error')).toBeNull();
    });

    it('marks focus and exposes the validity to Field.Validity', async () => {
        const { user } = render(
            <Field.Root data-testid='root' validationMode='onBlur'>
                <Field.Control control='input' required={true}>
                    <Field.Control.Slot />
                </Field.Control>
                <Field.Validity>{(state) => <span data-testid='validity'>{String(state.validity.valueMissing)}</span>}</Field.Validity>
            </Field.Root>
        );
        await user.click(screen.getByRole('textbox'));
        expect(screen.getByTestId('root')).toHaveAttribute('data-focused', '');
        await user.type(screen.getByRole('textbox'), 'a');
        await user.clear(screen.getByRole('textbox'));
        await user.tab();
        expect(screen.getByTestId('validity')).toHaveTextContent('true');
    });

    it('disables the control', () => {
        render(
            <Field.Root disabled={true} data-testid='root'>
                <Field.Control control='input'>
                    <Field.Control.Slot />
                </Field.Control>
            </Field.Root>
        );
        expect(screen.getByRole('textbox')).toBeDisabled();
        expect(screen.getByTestId('root')).toHaveAttribute('data-disabled', '');
    });

    it('shows form errors and clears them on change', async () => {
        const { user } = render(
            <Form errors={{ email: 'Already registered' }}>
                <Field.Root name='email'>
                    <Field.Control control='input'>
                        <Field.Control.Slot />
                    </Field.Control>
                    <Field.Error data-testid='error' />
                </Field.Root>
            </Form>
        );
        expect(screen.getByTestId('error')).toHaveTextContent('Already registered');
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
        await user.type(screen.getByRole('textbox'), 'x');
        expect(screen.queryByTestId('error')).toBeNull();
    });

    it('validates on submit, focuses the invalid control and reports valid values', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='email'>
                    <Field.Control control='input' required={true}>
                        <Field.Control.Slot />
                    </Field.Control>
                    <Field.Error data-testid='error' />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        await user.click(screen.getByRole('button'));
        expect(onFormSubmit).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox')).toHaveFocus();
        expect(screen.getByTestId('error')).toBeInTheDocument();

        // After a submit attempt, onSubmit mode validates on change.
        await user.type(screen.getByRole('textbox'), 'me@example.com');
        expect(screen.queryByTestId('error')).toBeNull();
        await user.click(screen.getByRole('button'));
        expect(onFormSubmit).toHaveBeenCalledWith({ email: 'me@example.com' }, expect.anything());
    });

    it('disables the fields of a disabled fieldset and labels it with the legend', () => {
        render(
            <Fieldset.Root disabled={true} data-testid='fieldset'>
                <Fieldset.Legend>Account</Fieldset.Legend>
                <Field.Root>
                    <Field.Control control='input'>
                        <Field.Control.Slot />
                    </Field.Control>
                </Field.Root>
            </Fieldset.Root>
        );
        const fieldset = screen.getByTestId('fieldset');
        expect(fieldset).toHaveAttribute('aria-labelledby', screen.getByText('Account').id);
        expect(fieldset).toHaveAttribute('data-disabled', '');
        expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('lets Input report filled and dirty state', () => {
        render(
            <Field.Root data-testid='root'>
                <Input defaultValue='hello'>
                    <Input.Slot />
                </Input>
            </Field.Root>
        );
        expect(screen.getByTestId('root')).toHaveAttribute('data-filled', '');
        act(() => {
            fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
        });
        expect(screen.getByTestId('root')).not.toHaveAttribute('data-filled');
        expect(screen.getByTestId('root')).toHaveAttribute('data-dirty', '');
    });
});
