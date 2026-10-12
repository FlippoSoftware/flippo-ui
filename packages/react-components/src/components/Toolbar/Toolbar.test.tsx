import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { Toggle } from '../Toggle';
import { ToggleGroup } from '../ToggleGroup';

import { Toolbar } from '.';

describe.each(RENDER_MODES)('Toolbar ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    const button = (name: string) => screen.getByRole('button', { name });

    it('renders a toolbar and moves focus between its items', async () => {
        const { user } = render(
            <Toolbar.Root data-testid='root'>
                <Toolbar.Button>Bold</Toolbar.Button>
                <Toolbar.Separator />
                <Toolbar.Link href='#docs'>Docs</Toolbar.Link>
                <Toolbar.Input aria-label='Search' defaultValue='' />
            </Toolbar.Root>
        );
        const root = screen.getByRole('toolbar');
        expect(root).toHaveAttribute('aria-orientation', 'horizontal');
        expect(button('Bold')).toHaveAttribute('tabindex', '0');
        expect(screen.getByRole('link')).toHaveAttribute('tabindex', '-1');
        // The separator takes the toolbar's orientation.
        expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');

        await user.tab();
        expect(button('Bold')).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(screen.getByRole('link')).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(screen.getByRole('textbox')).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(button('Bold')).toHaveFocus();
    });

    it('uses vertical keys when vertical', async () => {
        const { user } = render(
            <Toolbar.Root orientation='vertical'>
                <Toolbar.Button>A</Toolbar.Button>
                <Toolbar.Button>B</Toolbar.Button>
            </Toolbar.Root>
        );
        expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
        await user.tab();
        await user.keyboard('[ArrowDown]');
        expect(button('B')).toHaveFocus();
    });

    it('keeps disabled buttons focusable unless focusableWhenDisabled is false', async () => {
        const onClick = vi.fn();
        const { user } = render(
            <Toolbar.Root>
                <Toolbar.Button>A</Toolbar.Button>
                <Toolbar.Button disabled={true} onClick={onClick}>
                    B
                </Toolbar.Button>
                <Toolbar.Button disabled={true} focusableWhenDisabled={false}>
                    C
                </Toolbar.Button>
                <Toolbar.Button>D</Toolbar.Button>
            </Toolbar.Root>
        );
        expect(button('B')).toHaveAttribute('aria-disabled', 'true');
        expect(button('B')).toHaveAttribute('data-disabled', '');
        await user.tab();
        await user.keyboard('[ArrowRight]');
        expect(button('B')).toHaveFocus();
        await user.keyboard('[Enter]');
        expect(onClick).not.toHaveBeenCalled();
        await user.keyboard('[ArrowRight]');
        expect(button('D')).toHaveFocus();
    });

    it('disables the items of a disabled toolbar or group', () => {
        const { rerender } = render(
            <Toolbar.Root>
                <Toolbar.Group disabled={true} data-testid='group'>
                    <Toolbar.Button>A</Toolbar.Button>
                </Toolbar.Group>
                <Toolbar.Button>B</Toolbar.Button>
            </Toolbar.Root>
        );
        expect(screen.getByTestId('group')).toHaveAttribute('role', 'group');
        expect(button('A')).toHaveAttribute('data-disabled', '');
        expect(button('B')).not.toHaveAttribute('data-disabled');

        rerender(
            <Toolbar.Root disabled={true}>
                <Toolbar.Button>B</Toolbar.Button>
            </Toolbar.Root>
        );
        expect(button('B')).toHaveAttribute('data-disabled', '');
        expect(screen.getByRole('toolbar')).toHaveAttribute('data-disabled', '');
    });

    it('includes toggle group buttons in its navigation', async () => {
        const onValueChange = vi.fn();
        const { user } = render(
            <Toolbar.Root>
                <Toolbar.Button>Undo</Toolbar.Button>
                <ToggleGroup onValueChange={onValueChange}>
                    <Toolbar.Button render={<Toggle value='bold' />}>Bold</Toolbar.Button>
                    <Toolbar.Button render={<Toggle value='italic' />}>Italic</Toolbar.Button>
                </ToggleGroup>
            </Toolbar.Root>
        );
        await user.tab();
        await user.keyboard('[ArrowRight]');
        expect(button('Bold')).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(button('Italic')).toHaveFocus();
        await user.keyboard('[Enter]');
        expect(onValueChange).toHaveBeenCalledWith(['italic'], expect.anything());
        expect(button('Italic')).toHaveAttribute('aria-pressed', 'true');
    });
});
