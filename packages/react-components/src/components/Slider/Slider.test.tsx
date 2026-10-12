import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { Field } from '../Field';
import { Form } from '../Form';

import { Slider } from '.';

describe.each(RENDER_MODES)('Slider ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    function TestSlider(props: Partial<Slider.Root.Props> & { thumbs?: number }) {
        const { thumbs = 1, ...rootProps } = props;
        return (
            <Slider.Root data-testid='root' {...(rootProps as Slider.Root.Props)}>
                <Slider.Value data-testid='value' />
                <Slider.Control data-testid='control'>
                    <Slider.Track>
                        <Slider.Indicator data-testid='indicator' />
                        {Array.from({ length: thumbs }, (_, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: static list
                            <Slider.Thumb key={index} aria-label={`Thumb ${index + 1}`} />
                        ))}
                    </Slider.Track>
                </Slider.Control>
            </Slider.Root>
        );
    }

    const slider = (index = 0) => screen.getAllByRole('slider')[index] as HTMLElement;

    it('exposes the value through ARIA and the value output', () => {
        render(<TestSlider defaultValue={30} />);
        expect(slider()).toHaveAttribute('aria-valuenow', '30');
        // The thumb's native range input carries the bounds.
        expect(slider()).toHaveAttribute('min', '0');
        expect(slider()).toHaveAttribute('max', '100');
        expect(screen.getByTestId('value')).toHaveTextContent('30');
        expect(screen.getByTestId('root')).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('steps with the keyboard', async () => {
        const onValueChange = vi.fn();
        const onValueCommitted = vi.fn();
        const { user } = render(
            <TestSlider defaultValue={30} step={5} onValueChange={onValueChange} onValueCommitted={onValueCommitted} />
        );
        await user.tab();
        await user.keyboard('[ArrowRight]');
        expect(slider()).toHaveAttribute('aria-valuenow', '35');
        expect(onValueChange).toHaveBeenLastCalledWith(35, expect.anything());
        expect(onValueCommitted).toHaveBeenLastCalledWith(35, expect.anything());
        await user.keyboard('[ArrowLeft][ArrowLeft]');
        expect(slider()).toHaveAttribute('aria-valuenow', '25');
        await user.keyboard('[End]');
        expect(slider()).toHaveAttribute('aria-valuenow', '100');
        await user.keyboard('[Home]');
        expect(slider()).toHaveAttribute('aria-valuenow', '0');
    });

    it('keeps range thumbs in order', async () => {
        const { user } = render(<TestSlider defaultValue={[20, 25]} step={10} thumbs={2} />);
        expect(slider(0)).toHaveAttribute('aria-valuenow', '20');
        expect(slider(1)).toHaveAttribute('aria-valuenow', '25');
        await user.tab();
        await user.keyboard('[ArrowRight]');
        expect(Number(slider(0).getAttribute('aria-valuenow'))).toBeLessThanOrEqual(25);
    });

    it('follows the controlled value', async () => {
        const onValueChange = vi.fn();
        const { user, rerender } = render(<TestSlider value={50} onValueChange={onValueChange} />);
        await user.tab();
        await user.keyboard('[ArrowRight]');
        expect(onValueChange).toHaveBeenCalledWith(51, expect.anything());
        expect(slider()).toHaveAttribute('aria-valuenow', '50');
        rerender(<TestSlider value={70} onValueChange={onValueChange} />);
        expect(slider()).toHaveAttribute('aria-valuenow', '70');
    });

    it('moves the thumb when the control is pressed', async () => {
        // jsdom has no layout: the control spans 0–200px.
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() =>
            DOMRect.fromRect({ x: 0, y: 0, width: 200, height: 20 })
        );
        // jsdom has no pointer capture.
        HTMLElement.prototype.setPointerCapture ??= () => {};
        HTMLElement.prototype.releasePointerCapture ??= () => {};
        const onValueChange = vi.fn();
        const { user } = render(<TestSlider defaultValue={0} onValueChange={onValueChange} />);
        await user.pointer({ keys: '[MouseLeft>]', target: screen.getByTestId('control'), coords: { clientX: 100, clientY: 10 } });
        expect(onValueChange).toHaveBeenCalledWith(50, expect.anything());
    });

    it('ignores interaction when disabled', async () => {
        const { user } = render(<TestSlider defaultValue={30} disabled={true} />);
        expect(screen.getByTestId('root')).toHaveAttribute('data-disabled', '');
        await user.tab();
        await user.keyboard('[ArrowRight]');
        expect(slider()).toHaveAttribute('aria-valuenow', '30');
    });

    it('submits its value with a form', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='volume'>
                    <TestSlider defaultValue={30} />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        await user.tab();
        await user.keyboard('[ArrowRight]');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onFormSubmit).toHaveBeenCalledWith({ volume: 31 }, expect.anything());
    });
});
