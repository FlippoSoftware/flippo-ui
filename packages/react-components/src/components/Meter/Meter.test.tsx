import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Meter } from '.';

describe.each(RENDER_MODES)('Meter ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestMeter(props: Partial<Meter.Root.Props>) {
        return (
            <Meter.Root value={30} {...props}>
                <Meter.Label>Battery</Meter.Label>
                <Meter.Track data-testid='track'>
                    <Meter.Indicator data-testid='indicator' />
                </Meter.Track>
                <Meter.Value data-testid='value' />
            </Meter.Root>
        );
    }

    it('exposes the value through ARIA and is labelled by the label', () => {
        render(<TestMeter />);
        const meter = screen.getByRole('meter', { name: 'Battery' });
        expect(meter).toHaveAttribute('aria-valuenow', '30');
        expect(meter).toHaveAttribute('aria-valuemin', '0');
        expect(meter).toHaveAttribute('aria-valuemax', '100');
        expect(meter).toHaveAttribute('aria-valuetext', '30%');
    });

    it('shows the formatted value and sizes the indicator', () => {
        render(<TestMeter />);
        expect(screen.getByTestId('value')).toHaveTextContent('30%');
        expect(screen.getByTestId('value')).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByTestId('indicator').style.width).toBe('30%');
        expect(screen.getByTestId('indicator').style.insetInlineStart).toBe('0');
    });

    it('follows value, min and max changes', () => {
        const { rerender } = render(<TestMeter />);
        rerender(<TestMeter value={5} min={0} max={10} />);
        const meter = screen.getByRole('meter');
        expect(meter).toHaveAttribute('aria-valuenow', '5');
        expect(meter).toHaveAttribute('aria-valuemax', '10');
        expect(screen.getByTestId('indicator').style.width).toBe('50%');
    });

    it('formats with Intl options and a custom aria-valuetext', () => {
        const { rerender } = render(<TestMeter value={1234} max={2000} format={{ style: 'unit', unit: 'meter' }} locale='en-US' />);
        expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '1,234 m');
        expect(screen.getByTestId('value')).toHaveTextContent('1,234 m');

        rerender(<TestMeter value={10} getAriaValueText={(formatted, value) => `${value} of 100 (${formatted})`} />);
        expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '10 of 100 (10%)');
    });

    it('renders Meter.Value children as a function', () => {
        render(
            <Meter.Root value={40}>
                <Meter.Value data-testid='value'>{(formatted, value) => `${formatted}/${value}`}</Meter.Value>
            </Meter.Root>
        );
        expect(screen.getByTestId('value')).toHaveTextContent('40%/40');
    });

    it('drops aria-labelledby when the label unmounts', () => {
        const { rerender } = render(<TestMeter />);
        expect(screen.getByRole('meter')).toHaveAttribute('aria-labelledby');
        rerender(
            <Meter.Root value={30}>
                <Meter.Track />
            </Meter.Root>
        );
        expect(screen.getByRole('meter')).not.toHaveAttribute('aria-labelledby');
    });
});
