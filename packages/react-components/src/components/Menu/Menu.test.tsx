import React from 'react';

import { act, createRenderer, fireEvent, screen, waitFor } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { ContextMenu } from '../ContextMenu';
import { Menubar } from '../Menubar';

import { Menu } from '.';

describe.each(RENDER_MODES)('Menu ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestMenu(props: Partial<Menu.Root.Props> & { onItemClick?: () => void; children?: React.ReactNode }) {
        const { onItemClick, children, ...rootProps } = props;
        return (
            <Menu.Root {...rootProps}>
                <Menu.Trigger>Actions</Menu.Trigger>
                <Menu.Portal>
                    <Menu.Positioner data-testid='positioner'>
                        <Menu.Popup data-testid='popup'>
                            <Menu.Arrow data-testid='arrow' />
                            <Menu.Item onClick={onItemClick}>Copy</Menu.Item>
                            <Menu.Item disabled={true}>Cut</Menu.Item>
                            <Menu.Item>Paste</Menu.Item>
                            {children}
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
        );
    }

    const trigger = () => screen.getByRole('button', { name: 'Actions', hidden: true });
    const item = (name: string) => screen.getByRole('menuitem', { name });

    // A mouse press opens the menu in the next animation frame.
    async function open(user: { click: (element: Element) => Promise<void> }, element: Element = trigger(), testId = 'popup') {
        await user.click(element);
        await waitFor(() => expect(screen.getByTestId(testId)).toBeInTheDocument());
    }

    it('opens on click and renders the menu', async () => {
        const onOpenChange = vi.fn();
        const { user } = render(<TestMenu onOpenChange={onOpenChange} />);
        expect(trigger()).toHaveAttribute('aria-haspopup', 'menu');
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
        await open(user);
        const menu = screen.getByRole('menu');
        expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ reason: 'trigger-press' }));
        expect(trigger()).toHaveAttribute('aria-expanded', 'true');
        expect(trigger()).toHaveAttribute('data-popup-open', '');
        expect(menu).toHaveAttribute('data-open', '');
        expect(screen.getAllByRole('menuitem')).toHaveLength(3);
        expect(item('Cut')).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByTestId('arrow')).toHaveAttribute('aria-hidden', 'true');
    });

    it('navigates items with the keyboard and activates them', async () => {
        const onItemClick = vi.fn();
        const { user } = render(<TestMenu onItemClick={onItemClick} />);
        trigger().focus();
        await user.keyboard('[ArrowDown]');
        await waitFor(() => expect(item('Copy')).toHaveFocus());
        expect(item('Copy')).toHaveAttribute('data-highlighted', '');
        await user.keyboard('[ArrowDown]');
        // The disabled item stays focusable.
        expect(item('Cut')).toHaveFocus();
        await user.keyboard('[ArrowDown]');
        expect(item('Paste')).toHaveFocus();
        await user.keyboard('[Home]');
        expect(item('Copy')).toHaveFocus();
        await user.keyboard('[Enter]');
        expect(onItemClick).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const { user } = render(<TestMenu />);
        await open(user);
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
        await waitFor(() => expect(trigger()).toHaveFocus());
    });

    it('closes when an item is clicked', async () => {
        const onItemClick = vi.fn();
        const onOpenChange = vi.fn();
        const { user } = render(<TestMenu onItemClick={onItemClick} onOpenChange={onOpenChange} />);
        await open(user);
        await user.click(item('Paste'));
        expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'item-press' }));
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });

    it('selects with typeahead', async () => {
        const { user } = render(<TestMenu />);
        await open(user);
        await user.keyboard('p');
        await waitFor(() => expect(item('Paste')).toHaveFocus());
    });

    it('follows the controlled open state', async () => {
        const onOpenChange = vi.fn();
        const { user, rerender } = render(<TestMenu open={false} onOpenChange={onOpenChange} />);
        await user.click(trigger());
        await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything()));
        expect(screen.queryByRole('menu')).toBeNull();
        rerender(<TestMenu open={true} onOpenChange={onOpenChange} />);
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('toggles checkbox items and selects radio items', async () => {
        const onCheckedChange = vi.fn();
        const onValueChange = vi.fn();
        const { user } = render(
            <TestMenu>
                <Menu.CheckboxItem onCheckedChange={onCheckedChange}>
                    Wrap
                    <Menu.CheckboxItemIndicator data-testid='check' />
                </Menu.CheckboxItem>
                <Menu.Group>
                    <Menu.GroupLabel>Sort</Menu.GroupLabel>
                    <Menu.RadioGroup defaultValue='name' onValueChange={onValueChange}>
                        <Menu.RadioItem value='name'>
                            Name
                            <Menu.RadioItemIndicator data-testid='radio-name' />
                        </Menu.RadioItem>
                        <Menu.RadioItem value='date'>
                            Date
                            <Menu.RadioItemIndicator data-testid='radio-date' />
                        </Menu.RadioItem>
                    </Menu.RadioGroup>
                </Menu.Group>
            </TestMenu>
        );
        await open(user);
        const wrap = screen.getByRole('menuitemcheckbox', { name: 'Wrap' });
        expect(wrap).toHaveAttribute('aria-checked', 'false');
        expect(screen.queryByTestId('check')).toBeNull();
        await user.click(wrap);
        expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
        expect(wrap).toHaveAttribute('aria-checked', 'true');
        expect(wrap).toHaveAttribute('data-checked', '');
        expect(screen.getByTestId('check')).toBeInTheDocument();
        // Checkbox items keep the menu open.
        expect(screen.getByRole('menu')).toBeInTheDocument();

        expect(screen.getAllByRole('group')[0]).toHaveAttribute('aria-labelledby', screen.getByText('Sort').id);
        expect(screen.getByRole('menuitemradio', { name: 'Name' })).toHaveAttribute('aria-checked', 'true');
        await user.click(screen.getByRole('menuitemradio', { name: 'Date' }));
        expect(onValueChange).toHaveBeenCalledWith('date', expect.anything());
        expect(screen.getByRole('menuitemradio', { name: 'Date' })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('menuitemradio', { name: 'Name' })).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByTestId('radio-date')).toBeInTheDocument();
    });

    it('opens a submenu with the keyboard and closes it with ArrowLeft', async () => {
        const { user } = render(
            <TestMenu>
                <Menu.SubmenuRoot>
                    <Menu.SubmenuTrigger>More</Menu.SubmenuTrigger>
                    <Menu.Portal>
                        <Menu.Positioner>
                            <Menu.Popup data-testid='submenu'>
                                <Menu.Item>Nested</Menu.Item>
                            </Menu.Popup>
                        </Menu.Positioner>
                    </Menu.Portal>
                </Menu.SubmenuRoot>
            </TestMenu>
        );
        await open(user);
        const more = item('More');
        expect(more).toHaveAttribute('aria-haspopup', 'menu');
        more.focus();
        await user.keyboard('[ArrowRight]');
        await waitFor(() => expect(screen.getByTestId('submenu')).toBeInTheDocument());
        await waitFor(() => expect(item('Nested')).toHaveFocus());
        await user.keyboard('[ArrowLeft]');
        await waitFor(() => expect(screen.queryByTestId('submenu')).toBeNull());
        expect(screen.getByTestId('popup')).toBeInTheDocument();
    });

    it('closes through actionsRef and from a handle', async () => {
        const actionsRef = React.createRef<Menu.Root.Actions>() as React.RefObject<Menu.Root.Actions>;
        const { user } = render(<TestMenu actionsRef={actionsRef} />);
        await open(user);
        act(() => actionsRef.current.close());
        await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    });

    it('works inside a menubar', async () => {
        const { user } = render(
            <Menubar>
                {['File', 'Edit'].map((name) => (
                    <Menu.Root key={name}>
                        <Menu.Trigger>{name}</Menu.Trigger>
                        <Menu.Portal>
                            <Menu.Positioner>
                                <Menu.Popup data-testid={`menu-${name}`}>
                                    <Menu.Item>{`${name} item`}</Menu.Item>
                                </Menu.Popup>
                            </Menu.Positioner>
                        </Menu.Portal>
                    </Menu.Root>
                ))}
            </Menubar>
        );
        expect(screen.getByRole('menubar')).toBeInTheDocument();
        const file = screen.getByRole('menuitem', { name: 'File' });
        await open(user, file, 'menu-File');
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByTestId('menu-File')).toBeNull());
        // The menubar moves focus between its triggers.
        file.focus();
        await user.keyboard('[ArrowRight]');
        expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
        await user.keyboard('[ArrowDown]');
        await waitFor(() => expect(screen.getByTestId('menu-Edit')).toBeInTheDocument());
    });

    it('opens a context menu on right click', async () => {
        const { user } = render(
            <ContextMenu.Root>
                <ContextMenu.Trigger data-testid='area'>Right click</ContextMenu.Trigger>
                <ContextMenu.Portal>
                    <ContextMenu.Positioner>
                        <ContextMenu.Popup data-testid='context'>
                            <ContextMenu.Item>Reload</ContextMenu.Item>
                        </ContextMenu.Popup>
                    </ContextMenu.Positioner>
                </ContextMenu.Portal>
            </ContextMenu.Root>
        );
        expect(screen.queryByTestId('context')).toBeNull();
        fireEvent.contextMenu(screen.getByTestId('area'), { clientX: 10, clientY: 10 });
        await waitFor(() => expect(screen.getByTestId('context')).toBeInTheDocument());
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByTestId('context')).toBeNull());
    });
});
