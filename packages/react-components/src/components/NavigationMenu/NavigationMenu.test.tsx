import React from 'react';

import { createRenderer, screen, waitFor } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { NavigationMenu } from '.';

describe.each(RENDER_MODES)('NavigationMenu ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestNavigationMenu(props: Partial<NavigationMenu.Root.Props>) {
        return (
            <NavigationMenu.Root data-testid='root' {...props}>
                <NavigationMenu.List data-testid='list'>
                    <NavigationMenu.Item value='products'>
                        <NavigationMenu.Trigger>
                            Products
                            <NavigationMenu.Icon data-testid='icon' />
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content data-testid='products-content'>
                            <NavigationMenu.Link href='#a' closeOnClick={true}>
                                Product A
                            </NavigationMenu.Link>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item value='docs'>
                        <NavigationMenu.Trigger>Docs</NavigationMenu.Trigger>
                        <NavigationMenu.Content data-testid='docs-content'>
                            <NavigationMenu.Link href='#b'>Guide</NavigationMenu.Link>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                    <NavigationMenu.Item>
                        <NavigationMenu.Link href='#about'>About</NavigationMenu.Link>
                    </NavigationMenu.Item>
                </NavigationMenu.List>
                <NavigationMenu.Portal>
                    <NavigationMenu.Positioner data-testid='positioner'>
                        <NavigationMenu.Popup data-testid='popup'>
                            <NavigationMenu.Viewport data-testid='viewport' />
                        </NavigationMenu.Popup>
                    </NavigationMenu.Positioner>
                </NavigationMenu.Portal>
            </NavigationMenu.Root>
        );
    }

    const trigger = (name: string) => screen.getByRole('button', { name });

    it('renders a navigation landmark and opens the content of a clicked trigger', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestNavigationMenu onValueChange={onValueChange} />);
        expect(screen.getByRole('navigation')).toBe(screen.getByTestId('root'));
        expect(trigger('Products')).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByTestId('products-content')).toBeNull();

        await user.click(trigger('Products'));
        expect(onValueChange).toHaveBeenLastCalledWith('products', expect.anything());
        await waitFor(() => expect(screen.getByTestId('products-content')).toBeInTheDocument());
        expect(trigger('Products')).toHaveAttribute('aria-expanded', 'true');
        expect(trigger('Products')).toHaveAttribute('data-popup-open', '');
        expect(screen.getByTestId('icon')).toHaveAttribute('data-popup-open', '');
        expect(screen.getByTestId('viewport')).toContainElement(screen.getByTestId('products-content'));
        expect(screen.getByTestId('root')).toHaveAttribute('data-open', '');
    });

    it('switches between items and closes on a second click', async () => {
        const { user } = render(<TestNavigationMenu />);
        await user.click(trigger('Products'));
        await waitFor(() => expect(screen.getByTestId('products-content')).toBeInTheDocument());
        trigger('Docs').focus();
        await user.keyboard('[Enter]');
        await waitFor(() => expect(screen.getByTestId('docs-content')).toBeInTheDocument());
        expect(trigger('Products')).toHaveAttribute('aria-expanded', 'false');
        await user.click(trigger('Docs'));
        await waitFor(() => expect(screen.queryByTestId('docs-content')).toBeNull());
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const { user } = render(<TestNavigationMenu />);
        await user.click(trigger('Products'));
        await waitFor(() => expect(screen.getByTestId('products-content')).toBeInTheDocument());
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByTestId('products-content')).toBeNull());
        expect(trigger('Products')).toHaveFocus();
    });

    it('moves focus between triggers with the arrow keys', async () => {
        const { user } = render(<TestNavigationMenu />);
        await user.tab();
        expect(trigger('Products')).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(trigger('Docs')).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(screen.getByRole('link', { name: 'About' })).toHaveFocus();
    });

    it('follows the controlled value', async () => {
        const { rerender } = render(<TestNavigationMenu value={null} />);
        expect(screen.queryByTestId('docs-content')).toBeNull();
        rerender(<TestNavigationMenu value='docs' />);
        await waitFor(() => expect(screen.getByTestId('docs-content')).toBeInTheDocument());
        rerender(<TestNavigationMenu value={null} />);
        await waitFor(() => expect(screen.queryByTestId('docs-content')).toBeNull());
    });

    it('closes when a link is pressed', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestNavigationMenu onValueChange={onValueChange} />);
        await user.click(trigger('Products'));
        await waitFor(() => expect(screen.getByRole('link', { name: 'Product A' })).toBeInTheDocument());
        await user.click(screen.getByRole('link', { name: 'Product A' }));
        expect(onValueChange).toHaveBeenLastCalledWith(null, expect.objectContaining({ reason: 'link-press' }));
        // A hover that started before the press doesn't reopen the menu.
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(onValueChange).toHaveBeenLastCalledWith(null, expect.anything());
    });
});
