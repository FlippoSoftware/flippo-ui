import React from 'react';

import { createRenderer, screen, waitFor } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Drawer } from '.';

describe.each(RENDER_MODES)('Drawer ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestDrawer(props: Partial<Drawer.Root.Props>) {
        return (
            <Drawer.Root {...props}>
                <Drawer.Trigger>Open</Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Backdrop data-testid='backdrop' />
                    <Drawer.Popup data-testid='popup'>
                        <Drawer.Drag data-testid='drag' closeThreshold={50} />
                        <Drawer.Title>Title</Drawer.Title>
                        <Drawer.Close>Close</Drawer.Close>
                    </Drawer.Popup>
                </Drawer.Portal>
            </Drawer.Root>
        );
    }

    const trigger = () => screen.getByRole('button', { name: 'Open', hidden: true });

    it('opens as a dialog with the direction attributes', async () => {
        const { user } = render(<TestDrawer direction='left' />);
        await user.click(trigger());
        const popup = screen.getByRole('dialog');
        expect(popup).toHaveAttribute('data-direction', 'left');
        expect(popup).toHaveAttribute('data-swipe-direction-left', '');
        expect(popup).toHaveAttribute('aria-labelledby', screen.getByText('Title').id);
        expect(screen.getByTestId('backdrop')).toHaveAttribute('data-swipe-direction-left', '');
        expect(screen.getByTestId('drag')).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByTestId('drag')).toHaveAttribute('data-open', '');
    });

    it('closes with the close button and resets the snap point', async () => {
        const onSnapPointChange = vi.fn();
        const { user } = render(<TestDrawer snapPoints={['50%', '100%']} onSnapPointChange={onSnapPointChange} />);
        await user.click(trigger());
        expect(screen.getByRole('dialog')).toHaveAttribute('data-snap-points', '');
        await user.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        expect(onSnapPointChange).toHaveBeenCalledWith(0);
    });

    it('closes when dragged past the threshold', async () => {
        const onDragEnd = vi.fn();
        const { user } = render(<TestDrawer onDragEnd={onDragEnd} />);
        await user.click(trigger());
        const drag = screen.getByTestId('drag');
        // jsdom has no pointer capture.
        HTMLElement.prototype.setPointerCapture ??= () => {};
        HTMLElement.prototype.releasePointerCapture ??= () => {};
        await user.pointer([
            { keys: '[MouseLeft>]', target: drag, coords: { clientY: 0 } },
            { target: drag, coords: { clientY: 10 } },
            { target: drag, coords: { clientY: 200 } },
            { keys: '[/MouseLeft]', target: drag, coords: { clientY: 200 } }
        ]);
        expect(onDragEnd).toHaveBeenCalledWith({ open: false });
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
});
