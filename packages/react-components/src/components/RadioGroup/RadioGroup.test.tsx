import React from 'react';

import { createRenderer, screen } from '@flippo/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { Field } from '../Field';
import { Form } from '../Form';
import { Radio } from '../Radio';

import { RadioGroup } from '.';

describe.each(RENDER_MODES)('RadioGroup ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestGroup(props: Partial<RadioGroup.Props>) {
        return (
            <RadioGroup aria-label='Size' data-testid='group' {...props}>
                {['small', 'medium', 'large'].map((value) => (
                    <Radio.Root key={value} value={value} aria-label={value}>
                        <Radio.Indicator data-testid={`indicator-${value}`} />
                    </Radio.Root>
                ))}
            </RadioGroup>
        );
    }

    const radio = (name: string) => screen.getByRole('radio', { name });

    it('selects the clicked radio', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestGroup onValueChange={onValueChange} />);
        expect(screen.getByRole('radiogroup')).toBeInTheDocument();
        expect(radio('small')).toHaveAttribute('aria-checked', 'false');

        await user.click(radio('medium'));
        expect(onValueChange).toHaveBeenCalledWith('medium', expect.anything());
        expect(radio('medium')).toHaveAttribute('aria-checked', 'true');
        expect(radio('medium')).toHaveAttribute('data-checked', '');
        expect(screen.getByTestId('indicator-medium')).toBeInTheDocument();
        expect(screen.queryByTestId('indicator-small')).toBeNull();
    });

    it('moves the selection with the arrow keys', async () => {
        const { user } = render(<TestGroup defaultValue='small' />);
        await user.tab();
        expect(radio('small')).toHaveFocus();
        await user.keyboard('[ArrowDown]');
        expect(radio('medium')).toHaveFocus();
        expect(radio('medium')).toHaveAttribute('aria-checked', 'true');
        await user.keyboard('[ArrowRight]');
        expect(radio('large')).toHaveAttribute('aria-checked', 'true');
    });

    it('follows the controlled value', async () => {
        const { user, rerender } = render(<TestGroup value='small' />);
        await user.click(radio('large'));
        expect(radio('small')).toHaveAttribute('aria-checked', 'true');
        rerender(<TestGroup value='large' />);
        expect(radio('large')).toHaveAttribute('aria-checked', 'true');
    });

    it('ignores interaction when disabled or read-only', async () => {
        const { user, rerender } = render(<TestGroup disabled={true} />);
        await user.click(radio('small'));
        expect(radio('small')).toHaveAttribute('aria-checked', 'false');
        expect(radio('small')).toHaveAttribute('data-disabled', '');

        rerender(<TestGroup readOnly={true} />);
        await user.click(radio('small'));
        expect(radio('small')).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
    });

    it('submits the selected value and validates required', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='size'>
                    <TestGroup required={true} />
                    <Field.Error data-testid='error' />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onFormSubmit).not.toHaveBeenCalled();
        expect(screen.getByTestId('error')).toBeInTheDocument();

        await user.click(radio('large'));
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onFormSubmit).toHaveBeenCalledWith({ size: 'large' }, expect.anything());
    });
});
