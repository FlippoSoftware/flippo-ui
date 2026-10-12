import React from 'react';

import { act, createRenderer, screen, waitFor } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Tooltip } from '.';

describe.each(RENDER_MODES)('Tooltip ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestTooltip(props: Partial<Tooltip.Root.Props> & { triggerProps?: Partial<Tooltip.Trigger.Props>; label?: string }) {
        const { triggerProps, label = 'Hint', ...rootProps } = props;
        return (
            <Tooltip.Root {...rootProps}>
                <Tooltip.Trigger delay={0} {...triggerProps}>
                    {`Trigger ${label}`}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Positioner data-testid={`positioner-${label}`}>
                        <Tooltip.Popup data-testid={`popup-${label}`}>
                            <Tooltip.Arrow data-testid={`arrow-${label}`} />
                            {label}
                        </Tooltip.Popup>
                    </Tooltip.Positioner>
                </Tooltip.Portal>
            </Tooltip.Root>
        );
    }

    const trigger = (label = 'Hint') => screen.getByRole('button', { name: `Trigger ${label}` });

    it('opens on hover and closes when the pointer leaves', async () => {
        const onOpenChange = vi.fn();
        const { user } = render(<TestTooltip onOpenChange={onOpenChange} />);
        expect(screen.queryByTestId('popup-Hint')).toBeNull();
        await user.hover(trigger());
        await waitFor(() => expect(screen.getByTestId('popup-Hint')).toBeInTheDocument());
        expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ reason: 'trigger-hover' }));
        expect(trigger()).toHaveAttribute('data-popup-open', '');
        expect(screen.getByTestId('popup-Hint')).toHaveAttribute('data-open', '');
        expect(screen.getByTestId('positioner-Hint')).toHaveAttribute('data-side', 'top');
        expect(screen.getByTestId('arrow-Hint')).toHaveAttribute('aria-hidden', 'true');
        await user.unhover(trigger());
        await waitFor(() => expect(screen.queryByTestId('popup-Hint')).toBeNull());
    });

    it('opens on focus and closes on Escape or press', async () => {
        const { user } = render(<TestTooltip />);
        await user.tab();
        await waitFor(() => expect(screen.getByTestId('popup-Hint')).toBeInTheDocument());
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByTestId('popup-Hint')).toBeNull());

        await user.hover(trigger());
        await waitFor(() => expect(screen.getByTestId('popup-Hint')).toBeInTheDocument());
        await user.click(trigger());
        await waitFor(() => expect(screen.queryByTestId('popup-Hint')).toBeNull());
    });

    it('does not open when disabled', async () => {
        const { user } = render(<TestTooltip disabled={true} />);
        await user.hover(trigger());
        await user.tab();
        expect(screen.queryByTestId('popup-Hint')).toBeNull();
        expect(trigger()).toHaveAttribute('data-trigger-disabled', '');
    });

    it('follows the controlled open state', async () => {
        const onOpenChange = vi.fn();
        const { user, rerender } = render(<TestTooltip open={false} onOpenChange={onOpenChange} />);
        await user.hover(trigger());
        await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything()));
        expect(screen.queryByTestId('popup-Hint')).toBeNull();
        rerender(<TestTooltip open={true} onOpenChange={onOpenChange} />);
        expect(screen.getByTestId('popup-Hint')).toBeInTheDocument();
    });

    it('closes through actionsRef and calls onOpenChangeComplete', async () => {
        const onOpenChangeComplete = vi.fn();
        const actionsRef = React.createRef<Tooltip.Root.Actions>() as React.RefObject<Tooltip.Root.Actions>;
        const { user } = render(<TestTooltip actionsRef={actionsRef} onOpenChangeComplete={onOpenChangeComplete} />);
        await user.hover(trigger());
        await waitFor(() => expect(onOpenChangeComplete).toHaveBeenCalledWith(true));
        act(() => actionsRef.current.close());
        await waitFor(() => expect(screen.queryByTestId('popup-Hint')).toBeNull());
    });

    it('uses the provider delay', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        try {
            const { user } = render(
                <Tooltip.Provider delay={500}>
                    <TestTooltip triggerProps={{ delay: undefined }} />
                </Tooltip.Provider>
            );
            await user.hover(trigger());
            expect(screen.queryByTestId('popup-Hint')).toBeNull();
            await act(async () => {
                vi.advanceTimersByTime(600);
            });
            await waitFor(() => expect(screen.getByTestId('popup-Hint')).toBeInTheDocument());
        } finally {
            vi.useRealTimers();
        }
    });

    it('opens the tooltips of a Multiple group together', async () => {
        const { user } = render(
            <Tooltip.Multiple delay={0}>
                <TestTooltip label='One' triggerProps={{ primary: true }} />
                <TestTooltip label='Two' triggerProps={{ primary: true }} />
            </Tooltip.Multiple>
        );
        await user.hover(trigger('One'));
        await waitFor(() => expect(screen.getByTestId('popup-One')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByTestId('popup-Two')).toBeInTheDocument());
        expect(screen.getByTestId('popup-One')).toHaveAttribute('data-multiple-active', '');
        expect(screen.getByTestId('popup-Two')).toHaveAttribute('aria-hidden', 'true');
    });
});
