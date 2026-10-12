import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { CheckboxGroup } from '../CheckboxGroup';
import { Field } from '../Field';
import { Form } from '../Form';

import { Checkbox } from '.';

describe.each(RENDER_MODES)('Checkbox ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestCheckbox(props: Partial<Checkbox.Root.Props>) {
        return (
            <Checkbox.Root data-testid='checkbox' {...props}>
                <Checkbox.Indicator data-testid='indicator' />
            </Checkbox.Root>
        );
    }

    it('toggles on click and renders the indicator only when checked', async () => {
        const onCheckedChange = vi.fn();
        const { user } = render(<TestCheckbox onCheckedChange={onCheckedChange} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('aria-checked', 'false');
        expect(checkbox).toHaveAttribute('data-unchecked', '');
        expect(screen.queryByTestId('indicator')).toBeNull();

        await user.click(checkbox);
        expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
        expect(checkbox).toHaveAttribute('aria-checked', 'true');
        expect(checkbox).toHaveAttribute('data-checked', '');
        expect(screen.getByTestId('indicator')).toHaveAttribute('data-checked', '');
    });

    it('toggles with the keyboard', async () => {
        const { user } = render(<TestCheckbox />);
        await user.tab();
        expect(screen.getByRole('checkbox')).toHaveFocus();
        await user.keyboard('[Space]');
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    });

    it('follows the controlled checked prop and supports cancellation', async () => {
        const { user, rerender } = render(<TestCheckbox checked={false} onCheckedChange={(_, details) => details.cancel()} />);
        await user.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
        rerender(<TestCheckbox checked={true} />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    });

    it('shows the indeterminate state', () => {
        render(<TestCheckbox indeterminate={true} />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
        expect(screen.getByRole('checkbox')).toHaveAttribute('data-indeterminate', '');
        expect(screen.getByTestId('indicator')).toBeInTheDocument();
    });

    it('ignores interaction when disabled or read-only', async () => {
        const { user, rerender } = render(<TestCheckbox disabled={true} />);
        await user.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByRole('checkbox')).toHaveAttribute('data-disabled', '');

        rerender(<TestCheckbox readOnly={true} />);
        await user.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-readonly', 'true');
    });

    it('submits its value with a form and validates required', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='terms'>
                    <Field.Label>Terms</Field.Label>
                    <TestCheckbox required={true} />
                    <Field.Error data-testid='error' />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        expect(screen.getByRole('checkbox', { name: 'Terms' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onFormSubmit).not.toHaveBeenCalled();
        expect(screen.getByTestId('error')).toBeInTheDocument();

        await user.click(screen.getByRole('checkbox'));
        expect(screen.queryByTestId('error')).toBeNull();
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onFormSubmit).toHaveBeenCalledWith({ terms: true }, expect.anything());
    });

    describe('in a CheckboxGroup', () => {
        it('reflects and updates the group value', async () => {
            const onValueChange = vi.fn();
            const { user } = render(
                <CheckboxGroup defaultValue={['a']} onValueChange={onValueChange}>
                    <Checkbox.Root value='a' aria-label='a' />
                    <Checkbox.Root value='b' aria-label='b' />
                </CheckboxGroup>
            );
            expect(screen.getByRole('checkbox', { name: 'a' })).toHaveAttribute('aria-checked', 'true');
            await user.click(screen.getByRole('checkbox', { name: 'b' }));
            expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b'], expect.anything());
            expect(screen.getByRole('checkbox', { name: 'b' })).toHaveAttribute('aria-checked', 'true');
        });

        it('drives the children from a parent checkbox', async () => {
            // The parent checkbox works with a controlled group value.
            function ParentGroup() {
                const [value, setValue] = React.useState<string[]>(['a']);
                return (
                    <CheckboxGroup value={value} onValueChange={setValue} allValues={['a', 'b']}>
                        <Checkbox.Root parent={true} aria-label='all' />
                        <Checkbox.Root value='a' aria-label='a' />
                        <Checkbox.Root value='b' aria-label='b' />
                    </CheckboxGroup>
                );
            }
            const { user } = render(<ParentGroup />);
            const all = screen.getByRole('checkbox', { name: 'all' });
            expect(all).toHaveAttribute('aria-checked', 'mixed');
            await user.click(all);
            expect(all).toHaveAttribute('aria-checked', 'true');
            expect(screen.getByRole('checkbox', { name: 'b' })).toHaveAttribute('aria-checked', 'true');
            await user.click(all);
            expect(screen.getByRole('checkbox', { name: 'a' })).toHaveAttribute('aria-checked', 'false');
        });

        it('is disabled by a disabled group', () => {
            render(
                <CheckboxGroup disabled={true}>
                    <Checkbox.Root value='a' aria-label='a' />
                </CheckboxGroup>
            );
            expect(screen.getByRole('checkbox')).toHaveAttribute('data-disabled', '');
        });
    });
});
