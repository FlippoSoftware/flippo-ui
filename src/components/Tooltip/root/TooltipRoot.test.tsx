import React from 'react';

import {
    fireEvent,
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from 'vitest';

import { Tooltip } from '..';

describe('tooltipRoot', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should open and close on hover', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Popup>{'Popup'}</Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );

        await user.hover(screen.getByText('Trigger'));
        await waitFor(() => expect(screen.getByText('Popup')).toBeInTheDocument());

        await user.unhover(screen.getByText('Trigger'));
        await waitForElementToBeRemoved(() => screen.queryByText('Popup'));
    });

    it('should open and close on focus', async () => {
        render(
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Popup>{'Popup'}</Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );

        fireEvent.focus(screen.getByText('Trigger'));
        await waitFor(() => expect(screen.getByText('Popup')).toBeInTheDocument());

        fireEvent.blur(screen.getByText('Trigger'));
        await waitForElementToBeRemoved(() => screen.queryByText('Popup'));
    });

    it('should call onOpenChange', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        const onOpenChange = vi.fn();
        render(
            <Tooltip.Provider>
                <Tooltip.Root onOpenChange={onOpenChange}>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Popup>{'Popup'}</Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );

        await user.hover(screen.getByText('Trigger'));
        await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));

        await user.unhover(screen.getByText('Trigger'));
        await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    });
});
