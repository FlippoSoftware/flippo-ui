import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Progress } from '.';

describe.each(RENDER_MODES)('Progress ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestProgress(props: Partial<Progress.Root.Props>) {
        return (
            <Progress.Root value={30} data-testid='root' {...props}>
                <Progress.Label>Upload</Progress.Label>
                <Progress.Track data-testid='track'>
                    <Progress.Indicator data-testid='indicator' />
                </Progress.Track>
                <Progress.Value data-testid='value' />
            </Progress.Root>
        );
    }

    it('exposes the value through ARIA and is labelled by the label', () => {
        render(<TestProgress />);
        const progress = screen.getByRole('progressbar', { name: 'Upload' });
        expect(progress).toHaveAttribute('aria-valuenow', '30');
        expect(progress).toHaveAttribute('aria-valuemin', '0');
        expect(progress).toHaveAttribute('aria-valuemax', '100');
        expect(progress).toHaveAttribute('aria-valuetext', '30%');
    });

    it('reflects the status in data attributes of every part', () => {
        const { rerender } = render(<TestProgress />);
        for (const id of ['root', 'track', 'indicator', 'value']) {
            expect(screen.getByTestId(id)).toHaveAttribute('data-progressing', '');
        }

        rerender(<TestProgress value={100} />);
        expect(screen.getByTestId('root')).toHaveAttribute('data-complete', '');
        expect(screen.getByTestId('indicator')).toHaveAttribute('data-complete', '');
        expect(screen.getByTestId('root')).not.toHaveAttribute('data-progressing');

        rerender(<TestProgress value={null} />);
        expect(screen.getByTestId('root')).toHaveAttribute('data-indeterminate', '');
        expect(screen.getByTestId('value')).toHaveAttribute('data-indeterminate', '');
    });

    it('sizes the indicator and shows the formatted value', () => {
        const { rerender } = render(<TestProgress />);
        expect(screen.getByTestId('indicator').style.width).toBe('30%');
        expect(screen.getByTestId('value')).toHaveTextContent('30%');
        expect(screen.getByTestId('value')).toHaveAttribute('aria-hidden', 'true');

        rerender(<TestProgress value={5} max={10} />);
        expect(screen.getByTestId('indicator').style.width).toBe('50%');
    });

    it('describes the indeterminate state', () => {
        render(<TestProgress value={null} />);
        const progress = screen.getByRole('progressbar');
        expect(progress).not.toHaveAttribute('aria-valuenow');
        expect(progress).toHaveAttribute('aria-valuetext', 'indeterminate progress');
        expect(screen.getByTestId('value')).toBeEmptyDOMElement();
        expect(screen.getByTestId('indicator').getAttribute('style')).toBeNull();
    });

    it('formats with Intl options and a custom aria-valuetext', () => {
        const { rerender } = render(<TestProgress value={1234} max={2000} format={{ style: 'unit', unit: 'byte' }} locale='en-US' />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '1,234 byte');

        rerender(<TestProgress value={10} getAriaValueText={(formatted, value) => `${value}: ${formatted}`} />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '10: 10%');
    });

    it('renders Progress.Value children as a function', () => {
        const { rerender } = render(
            <Progress.Root value={40}>
                <Progress.Value data-testid='value'>{(formatted, value) => `${formatted}/${value}`}</Progress.Value>
            </Progress.Root>
        );
        expect(screen.getByTestId('value')).toHaveTextContent('40%/40');

        rerender(
            <Progress.Root value={null}>
                <Progress.Value data-testid='value'>{(formatted, value) => `${formatted}/${value}`}</Progress.Value>
            </Progress.Root>
        );
        expect(screen.getByTestId('value')).toHaveTextContent('indeterminate/null');
    });
});
