import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { CheckboxGroup } from '../CheckboxGroup';
import { Field } from '../Field';
import { Form } from '../Form';

import { CheckboxCard } from '.';

describe.each(RENDER_MODES)('CheckboxCard ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestCard(props: Partial<CheckboxCard.Root.Props>) {
        return (
            <CheckboxCard.Root aria-label='Backups' {...props}>
                Backups
                <CheckboxCard.Indicator data-testid='indicator' />
            </CheckboxCard.Root>
        );
    }

    it('toggles on click', async () => {
        const onCheckedChange = vi.fn();
        const { user } = render(<TestCard onCheckedChange={onCheckedChange} />);
        const card = screen.getByRole('checkbox');
        expect(card).toHaveAttribute('aria-checked', 'false');
        await user.click(card);
        expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
        expect(card).toHaveAttribute('aria-checked', 'true');
        expect(card).toHaveAttribute('data-checked', '');
        expect(screen.getByTestId('indicator')).toBeInTheDocument();
    });

    it('follows the controlled checked prop and ignores a disabled card', async () => {
        const { user, rerender } = render(<TestCard checked={false} />);
        await user.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
        rerender(<TestCard checked={true} />);
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');

        rerender(<TestCard disabled={true} />);
        await user.click(screen.getByRole('checkbox'));
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
    });

    it('joins a checkbox group', async () => {
        const onValueChange = vi.fn();
        const { user } = render(
            <CheckboxGroup defaultValue={[]} onValueChange={onValueChange}>
                <TestCard value='backups' />
            </CheckboxGroup>
        );
        await user.click(screen.getByRole('checkbox'));
        expect(onValueChange).toHaveBeenCalledWith(['backups'], expect.anything());
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    });

    it('submits its value with a form', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='backups'>
                    <TestCard />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button'));
        expect(onFormSubmit).toHaveBeenCalledWith({ backups: true }, expect.anything());
    });
});
