import React from 'react';

import { act, createRenderer, screen, waitFor } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Popover } from '.';

describe.each(RENDER_MODES)('Popover ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestPopover(
        props: Partial<Popover.Root.Props> & { triggerProps?: Partial<Popover.Trigger.Props>; children?: React.ReactNode }
    ) {
        const { triggerProps, children, ...rootProps } = props;
        return (
            <Popover.Root {...rootProps}>
                <Popover.Trigger {...triggerProps}>Open</Popover.Trigger>
                <Popover.Portal>
                    <Popover.Positioner data-testid='positioner' side='top'>
                        <Popover.Popup data-testid='popup'>
                            <Popover.Arrow data-testid='arrow' />
                            <Popover.Title>Title</Popover.Title>
                            <Popover.Description>Description</Popover.Description>
                            <button type='button'>Inside</button>
                            {children}
                            <Popover.Close>Close</Popover.Close>
                        </Popover.Popup>
                    </Popover.Positioner>
                </Popover.Portal>
                <button type='button'>Outside</button>
            </Popover.Root>
        );
    }

    const trigger = () => screen.getByRole('button', { name: 'Open', hidden: true });

    it('opens on click and links the popup', async () => {
        const onOpenChange = vi.fn();
        const { user } = render(<TestPopover onOpenChange={onOpenChange} />);
        expect(screen.queryByTestId('popup')).toBeNull();
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');

        await user.click(trigger());
        const popup = screen.getByRole('dialog');
        expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ reason: 'trigger-press' }));
        expect(trigger()).toHaveAttribute('aria-expanded', 'true');
        expect(trigger()).toHaveAttribute('aria-controls', popup.id);
        expect(trigger()).toHaveAttribute('data-popup-open', '');
        expect(trigger()).toHaveAttribute('data-pressed', '');
        expect(popup).toHaveAttribute('aria-labelledby', screen.getByText('Title').id);
        expect(popup).toHaveAttribute('aria-describedby', screen.getByText('Description').id);
        expect(popup).toHaveAttribute('data-open', '');
        expect(popup).toHaveAttribute('data-side', 'top');
        expect(screen.getByTestId('positioner')).toHaveAttribute('data-side', 'top');
        expect(screen.getByTestId('arrow')).toHaveAttribute('aria-hidden', 'true');
    });

    it('moves focus into the popup and closes on Escape, returning focus', async () => {
        const { user } = render(<TestPopover />);
        await user.click(trigger());
        await waitFor(() => expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus());
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByTestId('popup')).toBeNull());
        await waitFor(() => expect(trigger()).toHaveFocus());
    });

    it('closes on an outside press, a second trigger click and the close button', async () => {
        const onOpenChange = vi.fn();
        const { user } = render(<TestPopover onOpenChange={onOpenChange} />);
        await user.click(trigger());
        await user.click(screen.getByRole('button', { name: 'Outside' }));
        expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'outside-press' }));
        await waitFor(() => expect(screen.queryByTestId('popup')).toBeNull());

        await user.click(trigger());
        await user.click(screen.getByRole('button', { name: 'Close' }));
        expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'close-press' }));
        await waitFor(() => expect(screen.queryByTestId('popup')).toBeNull());
    });

    it('follows the controlled open state', async () => {
        const onOpenChange = vi.fn();
        const { user, rerender } = render(<TestPopover open={false} onOpenChange={onOpenChange} />);
        await user.click(trigger());
        expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
        expect(screen.queryByTestId('popup')).toBeNull();
        rerender(<TestPopover open={true} onOpenChange={onOpenChange} />);
        expect(screen.getByTestId('popup')).toBeInTheDocument();
    });

    it('opens on hover with openOnHover', async () => {
        const { user } = render(<TestPopover triggerProps={{ openOnHover: true, delay: 0 }} />);
        await user.hover(trigger());
        await waitFor(() => expect(screen.getByTestId('popup')).toBeInTheDocument());
    });

    it('closes through actionsRef and calls onOpenChangeComplete', async () => {
        const onOpenChangeComplete = vi.fn();
        const actionsRef = React.createRef<Popover.Root.Actions>() as React.RefObject<Popover.Root.Actions>;
        const { user } = render(<TestPopover actionsRef={actionsRef} onOpenChangeComplete={onOpenChangeComplete} />);
        await user.click(trigger());
        await waitFor(() => expect(onOpenChangeComplete).toHaveBeenCalledWith(true));
        act(() => actionsRef.current.close());
        await waitFor(() => expect(screen.queryByTestId('popup')).toBeNull());
        await waitFor(() => expect(onOpenChangeComplete).toHaveBeenLastCalledWith(false));
    });

    it('opens from detached triggers with a payload', async () => {
        const handle = Popover.createHandle<string>();
        const { user } = render(
            <div>
                <Popover.Trigger handle={handle} payload='first'>
                    First
                </Popover.Trigger>
                <Popover.Trigger handle={handle} payload='second'>
                    Second
                </Popover.Trigger>
                <Popover.Root handle={handle}>
                    {({ payload }) => (
                        <Popover.Portal>
                            <Popover.Positioner>
                                <Popover.Popup data-testid='popup'>{payload}</Popover.Popup>
                            </Popover.Positioner>
                        </Popover.Portal>
                    )}
                </Popover.Root>
            </div>
        );
        await user.click(screen.getByRole('button', { name: 'Second' }));
        expect(screen.getByTestId('popup')).toHaveTextContent('second');
        expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true');
        await user.click(screen.getByRole('button', { name: 'First' }));
        await waitFor(() => expect(screen.getByTestId('popup')).toHaveTextContent('first'));
        act(() => handle.close());
        await waitFor(() => expect(screen.queryByTestId('popup')).toBeNull());
    });

    it('locks out the page with a modal popover', async () => {
        const { user } = render(<TestPopover modal={true} />);
        await user.click(trigger());
        // An internal backdrop blocks pointer interaction with the page.
        expect(document.querySelector('[data-base-ui-inert]')).not.toBeNull();
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByTestId('popup')).toBeNull());
    });

    it('keeps the popup mounted with keepMounted', async () => {
        const { user } = render(
            <Popover.Root>
                <Popover.Trigger>Open</Popover.Trigger>
                <Popover.Portal keepMounted={true}>
                    <Popover.Positioner data-testid='positioner'>
                        <Popover.Popup data-testid='popup'>
                            <Popover.Close>Close</Popover.Close>
                        </Popover.Popup>
                    </Popover.Positioner>
                </Popover.Portal>
            </Popover.Root>
        );
        expect(screen.getByTestId('positioner')).toHaveAttribute('hidden');
        await user.click(trigger());
        expect(screen.getByTestId('positioner')).not.toHaveAttribute('hidden');
    });

    it('closes a nested popover before its parent', async () => {
        const { user } = render(
            <TestPopover>
                <Popover.Root>
                    <Popover.Trigger>Open nested</Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Positioner>
                            <Popover.Popup data-testid='nested'>Nested</Popover.Popup>
                        </Popover.Positioner>
                    </Popover.Portal>
                </Popover.Root>
            </TestPopover>
        );
        await user.click(trigger());
        await user.click(screen.getByRole('button', { name: 'Open nested' }));
        expect(screen.getByTestId('nested')).toBeInTheDocument();
        // A press inside the nested popover is not outside the parent.
        await user.click(screen.getByText('Nested'));
        expect(screen.getByTestId('popup')).toBeInTheDocument();
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByTestId('nested')).toBeNull());
        expect(screen.getByTestId('popup')).toBeInTheDocument();
    });

    it('renders the content in the viewport and transitions between triggers', async () => {
        const handle = Popover.createHandle<string>();
        const { user } = render(
            <div>
                <Popover.Trigger handle={handle} payload='first'>
                    First
                </Popover.Trigger>
                <Popover.Trigger handle={handle} payload='second'>
                    Second
                </Popover.Trigger>
                <Popover.Root handle={handle}>
                    {({ payload }) => (
                        <Popover.Portal>
                            <Popover.Positioner>
                                <Popover.Popup>
                                    <Popover.Viewport data-testid='viewport'>{payload}</Popover.Viewport>
                                </Popover.Popup>
                            </Popover.Positioner>
                        </Popover.Portal>
                    )}
                </Popover.Root>
            </div>
        );
        await user.click(screen.getByRole('button', { name: 'First' }));
        const viewport = screen.getByTestId('viewport');
        expect(viewport.querySelector('[data-current]')).toHaveTextContent('first');
        await user.click(screen.getByRole('button', { name: 'Second' }));
        await waitFor(() => expect(viewport.querySelector('[data-current]')).toHaveTextContent('second'));
    });
});
