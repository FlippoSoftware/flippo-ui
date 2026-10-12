import React from 'react';

import { act, createRenderer, screen, waitFor } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Dialog } from '.';

describe.each(RENDER_MODES)('Dialog ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestDialog(props: Partial<Dialog.Root.Props> & { popupProps?: Partial<Dialog.Popup.Props>; children?: React.ReactNode }) {
        const { popupProps, children, ...rootProps } = props;
        return (
            <Dialog.Root {...rootProps}>
                <Dialog.Trigger>Open</Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop data-testid='backdrop' />
                    <Dialog.Popup data-testid='popup' {...popupProps}>
                        <Dialog.Title>Title</Dialog.Title>
                        <Dialog.Description>Description</Dialog.Description>
                        <input aria-label='first' />
                        {children}
                        <Dialog.Close>Close</Dialog.Close>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
        );
    }

    // A modal dialog hides the outside content from assistive technology.
    const trigger = () => screen.getByRole('button', { name: 'Open', hidden: true });

    it('opens from the trigger and links title and description', async () => {
        const onOpenChange = vi.fn();
        const { user } = render(<TestDialog onOpenChange={onOpenChange} />);
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');

        await user.click(trigger());
        const dialog = screen.getByRole('dialog');
        expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ reason: 'trigger-press' }));
        expect(trigger()).toHaveAttribute('aria-expanded', 'true');
        expect(trigger()).toHaveAttribute('data-popup-open', '');
        expect(dialog).toHaveAttribute('data-open', '');
        expect(dialog).toHaveAttribute('aria-labelledby', screen.getByText('Title').id);
        expect(dialog).toHaveAttribute('aria-describedby', screen.getByText('Description').id);
        expect(trigger()).toHaveAttribute('aria-controls', dialog.id);
    });

    it('moves focus into the popup and returns it to the trigger on close', async () => {
        const { user } = render(<TestDialog />);
        await user.click(trigger());
        await waitFor(() => expect(screen.getByLabelText('first')).toHaveFocus());
        await user.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(trigger()).toHaveFocus());
    });

    it('closes with Escape and with an outside press on the backdrop', async () => {
        const onOpenChange = vi.fn();
        const { user } = render(<TestDialog onOpenChange={onOpenChange} />);
        await user.click(trigger());
        await user.keyboard('[Escape]');
        expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'escape-key' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

        await user.click(trigger());
        await user.click(screen.getByTestId('backdrop'));
        expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'outside-press' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('does not close on an outside press with disablePointerDismissal', async () => {
        const { user } = render(<TestDialog disablePointerDismissal={true} />);
        await user.click(trigger());
        await user.click(screen.getByTestId('backdrop'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('traps focus in a modal dialog', async () => {
        const { user } = render(<TestDialog />);
        await user.click(trigger());
        await waitFor(() => expect(screen.getByLabelText('first')).toHaveFocus());
        await user.tab();
        expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
        await user.tab();
        await waitFor(() => expect(screen.getByLabelText('first')).toHaveFocus());
    });

    it('follows the controlled open state', async () => {
        const onOpenChange = vi.fn();
        const { user, rerender } = render(<TestDialog open={false} onOpenChange={onOpenChange} />);
        await user.click(trigger());
        expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
        expect(screen.queryByRole('dialog')).toBeNull();
        rerender(<TestDialog open={true} onOpenChange={onOpenChange} />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        rerender(<TestDialog open={false} onOpenChange={onOpenChange} />);
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('can cancel an open change', async () => {
        const { user } = render(
            <TestDialog
                onOpenChange={(open, details) => {
                    if (!open) {
                        details.cancel();
                    }
                }}
            />
        );
        await user.click(trigger());
        await user.keyboard('[Escape]');
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls onOpenChangeComplete and closes through actionsRef', async () => {
        const onOpenChangeComplete = vi.fn();
        const actionsRef = React.createRef<Dialog.Root.Actions>() as React.RefObject<Dialog.Root.Actions>;
        const { user } = render(<TestDialog actionsRef={actionsRef} onOpenChangeComplete={onOpenChangeComplete} />);
        await user.click(trigger());
        await waitFor(() => expect(onOpenChangeComplete).toHaveBeenCalledWith(true));
        act(() => actionsRef.current.close());
        await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
        await waitFor(() => expect(onOpenChangeComplete).toHaveBeenLastCalledWith(false));
    });

    it('marks nested dialogs', async () => {
        const { user } = render(
            <TestDialog>
                <Dialog.Root>
                    <Dialog.Trigger>Open nested</Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Popup data-testid='nested'>
                            <Dialog.Close>Close nested</Dialog.Close>
                        </Dialog.Popup>
                    </Dialog.Portal>
                </Dialog.Root>
            </TestDialog>
        );
        await user.click(trigger());
        await user.click(screen.getByRole('button', { name: 'Open nested' }));
        expect(screen.getByTestId('nested')).toHaveAttribute('data-nested', '');
        await waitFor(() => expect(screen.getByTestId('popup')).toHaveAttribute('data-nested-dialog-open', ''));
        // Escape closes only the topmost dialog.
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByTestId('nested')).toBeNull());
        expect(screen.getByTestId('popup')).toBeInTheDocument();
    });

    it('opens from a detached trigger with a payload through a handle', async () => {
        const handle = Dialog.createHandle<string>();
        const { user } = render(
            <div>
                <Dialog.Trigger handle={handle} payload='first'>
                    First
                </Dialog.Trigger>
                <Dialog.Trigger handle={handle} payload='second'>
                    Second
                </Dialog.Trigger>
                <Dialog.Root handle={handle}>
                    {({ payload }) => (
                        <Dialog.Portal>
                            <Dialog.Popup data-testid='popup'>{payload}</Dialog.Popup>
                        </Dialog.Portal>
                    )}
                </Dialog.Root>
            </div>
        );
        await user.click(screen.getByRole('button', { name: 'Second' }));
        expect(screen.getByTestId('popup')).toHaveTextContent('second');
        act(() => handle.close());
        await waitFor(() => expect(screen.queryByTestId('popup')).toBeNull());
        act(() => handle.openWithPayload('direct'));
        expect(screen.getByTestId('popup')).toHaveTextContent('direct');
    });

    it('keeps the popup mounted with keepMounted', async () => {
        const { user } = render(
            <Dialog.Root>
                <Dialog.Trigger>Open</Dialog.Trigger>
                <Dialog.Portal keepMounted={true}>
                    <Dialog.Popup data-testid='popup'>
                        <Dialog.Close>Close</Dialog.Close>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
        );
        expect(screen.getByTestId('popup')).toHaveAttribute('hidden');
        await user.click(trigger());
        expect(screen.getByTestId('popup')).not.toHaveAttribute('hidden');
        await user.click(screen.getByRole('button', { name: 'Close' }));
        await waitFor(() => expect(screen.getByTestId('popup')).toHaveAttribute('hidden'));
    });

    it('renders the popup inside the viewport', async () => {
        const { user } = render(
            <Dialog.Root>
                <Dialog.Trigger>Open</Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Viewport data-testid='viewport'>
                        <Dialog.Popup data-testid='popup' />
                    </Dialog.Viewport>
                </Dialog.Portal>
            </Dialog.Root>
        );
        await user.click(trigger());
        expect(screen.getByTestId('viewport')).toContainElement(screen.getByTestId('popup'));
        expect(screen.getByTestId('viewport')).toHaveAttribute('data-open', '');
    });
});
