import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { Field } from '../Field';
import { Form } from '../Form';

import { Switch } from '.';

describe.each(RENDER_MODES)('Switch ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestSwitch(props: Partial<Switch.Root.Props>) {
        return (
            <Switch.Root data-testid='switch' {...props}>
                <Switch.Thumb data-testid='thumb' />
            </Switch.Root>
        );
    }

    it('toggles on click and with the keyboard', async () => {
        const onCheckedChange = vi.fn();
        const { user } = render(<TestSwitch onCheckedChange={onCheckedChange} />);
        const control = screen.getByRole('switch');
        expect(control).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByTestId('thumb')).toHaveAttribute('data-unchecked', '');

        await user.click(control);
        expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
        expect(control).toHaveAttribute('aria-checked', 'true');
        expect(control).toHaveAttribute('data-checked', '');
        expect(screen.getByTestId('thumb')).toHaveAttribute('data-checked', '');

        await user.keyboard('[Space]');
        expect(control).toHaveAttribute('aria-checked', 'false');
    });

    it('follows the controlled checked prop and cancellation', async () => {
        const { user, rerender } = render(<TestSwitch checked={false} onCheckedChange={(_, details) => details.cancel()} />);
        await user.click(screen.getByRole('switch'));
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
        rerender(<TestSwitch checked={true} />);
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('starts checked with defaultChecked and ignores disabled or read-only interaction', async () => {
        const { user, rerender } = render(<TestSwitch defaultChecked={true} disabled={true} />);
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        await user.click(screen.getByRole('switch'));
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('switch')).toHaveAttribute('data-disabled', '');

        rerender(<TestSwitch defaultChecked={true} readOnly={true} />);
        await user.click(screen.getByRole('switch'));
        expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('switch')).toHaveAttribute('aria-readonly', 'true');
    });

    it('is labelled by a field label and submits its value', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='notifications'>
                    <Field.Label>Notifications</Field.Label>
                    <TestSwitch />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        await user.click(screen.getByRole('switch', { name: 'Notifications' }));
        await user.click(screen.getByRole('button'));
        expect(onFormSubmit).toHaveBeenCalledWith({ notifications: true }, expect.anything());
    });
});
