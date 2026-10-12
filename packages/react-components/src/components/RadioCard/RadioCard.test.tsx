import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { RadioGroup } from '../RadioGroup';

import { RadioCard } from '.';

describe.each(RENDER_MODES)('RadioCard ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestCards(props: Partial<RadioGroup.Props> & { disabledCard?: string }) {
        const { disabledCard, ...groupProps } = props;
        return (
            <RadioGroup aria-label='Plan' {...groupProps}>
                {['basic', 'pro'].map((value) => (
                    <RadioCard.Root key={value} value={value} aria-label={value} disabled={disabledCard === value}>
                        {value}
                        <RadioCard.Indicator data-testid={`indicator-${value}`} />
                    </RadioCard.Root>
                ))}
            </RadioGroup>
        );
    }

    const card = (name: string) => screen.getByRole('radio', { name });

    it('selects the clicked card', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestCards onValueChange={onValueChange} />);
        expect(card('basic')).toHaveAttribute('aria-checked', 'false');
        await user.click(card('pro'));
        expect(onValueChange).toHaveBeenCalledWith('pro', expect.anything());
        expect(card('pro')).toHaveAttribute('aria-checked', 'true');
        expect(card('pro')).toHaveAttribute('data-checked', '');
        expect(screen.getByTestId('indicator-pro')).toBeInTheDocument();
    });

    it('follows the controlled value and ignores disabled cards', async () => {
        const { user, rerender } = render(<TestCards value='basic' disabledCard='pro' />);
        expect(card('basic')).toHaveAttribute('aria-checked', 'true');
        await user.click(card('pro'));
        expect(card('pro')).toHaveAttribute('aria-checked', 'false');
        expect(card('pro')).toHaveAttribute('aria-disabled', 'true');
        rerender(<TestCards value='pro' />);
        expect(card('pro')).toHaveAttribute('aria-checked', 'true');
    });

    it('moves the selection with the arrow keys', async () => {
        const { user } = render(<TestCards defaultValue='basic' />);
        await user.click(card('basic'));
        await user.keyboard('[ArrowDown]');
        expect(card('pro')).toHaveFocus();
        expect(card('pro')).toHaveAttribute('aria-checked', 'true');
    });
});
