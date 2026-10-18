import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Button, Checkbox, Dialog, FlippoProvider, Popover, ThemeScript, useControlSize, useTheme } from '~@src';

afterEach(() => {
    cleanup();
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
});

function ThemeProbe({ id = 'probe' }: { id?: string }) {
    const { theme, resolvedTheme, colorScheme, themes, setTheme } = useTheme();
    return (
        <button type='button' data-testid={id} onClick={() => setTheme('dark')}>
            {[theme, resolvedTheme, colorScheme, themes.join(',')].join(' ')}
        </button>
    );
}

function SizeProbe({ family }: { family?: string }) {
    const state = useControlSize(family as string);
    return <span data-testid={`size-${family ?? 'global'}`}>{JSON.stringify(state)}</span>;
}

describe('FlippoProvider: theme', () => {
    it('puts the theme on <html>, none for system, and restores it on unmount', () => {
        const { rerender, unmount } = render(<FlippoProvider theme='dark' />);
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        rerender(<FlippoProvider theme='system' />);
        expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
        rerender(<FlippoProvider theme='light' />);
        unmount();
        expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    });

    it('resolves registered themes and changes the uncontrolled theme with setTheme', () => {
        render(
            <FlippoProvider defaultTheme='sepia' themes={{ sepia: 'light', night: 'dark' }}>
                <ThemeProbe />
            </FlippoProvider>
        );
        const probe = screen.getByTestId('probe');
        expect(probe.textContent).toBe('sepia sepia light light,dark,sepia,night');
        act(() => probe.click());
        expect(probe.textContent).toBe('dark dark dark light,dark,sepia,night');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('calls onThemeChange and follows the controlled theme', () => {
        const calls: string[] = [];
        render(
            <FlippoProvider theme='light' onThemeChange={(theme) => calls.push(theme)}>
                <ThemeProbe />
            </FlippoProvider>
        );
        act(() => screen.getByTestId('probe').click());
        expect(calls).toEqual(['dark']);
        expect(screen.getByTestId('probe').textContent).toMatch(/^light /);
    });

    it('scopes a nested theme to a wrapper and to the portals of the kit', () => {
        render(
            <FlippoProvider theme='light'>
                <FlippoProvider theme='dark'>
                    <ThemeProbe id='inner' />
                    <Popover.Root open={true}>
                        <Popover.Trigger>Open</Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Positioner>
                                <Popover.Popup>Inside</Popover.Popup>
                            </Popover.Positioner>
                        </Popover.Portal>
                    </Popover.Root>
                </FlippoProvider>
            </FlippoProvider>
        );
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(screen.getByTestId('inner').closest('[data-theme]')?.getAttribute('data-theme')).toBe('dark');
        expect(screen.getByText('Inside').closest('[data-theme]')?.getAttribute('data-theme')).toBe('dark');
    });

    it('keeps the outer theme in a nested provider without its own, and its setter', () => {
        render(
            <FlippoProvider defaultTheme='light'>
                <FlippoProvider size='small'>
                    <ThemeProbe id='inner' />
                    <Dialog.Root open={true}>
                        <Dialog.Portal>
                            <Dialog.Popup>Dialog</Dialog.Popup>
                        </Dialog.Portal>
                    </Dialog.Root>
                </FlippoProvider>
            </FlippoProvider>
        );
        const inner = screen.getByTestId('inner');
        expect(inner.closest('[data-theme]')).toBe(document.documentElement);
        expect(screen.getByText('Dialog').closest('[data-theme]')).toBe(document.documentElement);
        act(() => inner.click());
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('leaves the theme alone without one of its own, until setTheme', () => {
        document.documentElement.setAttribute('data-theme', 'dark');
        render(
            <FlippoProvider size='small'>
                <ThemeProbe />
            </FlippoProvider>
        );
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(screen.getByTestId('probe').closest('[data-theme]')).toBe(document.documentElement);
        act(() => screen.getByTestId('probe').click());
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(screen.getByTestId('probe').textContent).toMatch(/^dark dark dark/);
    });

    it('starts from the stored theme and stores the chosen one (storageKey)', () => {
        localStorage.setItem('theme', 'sepia');
        render(
            <FlippoProvider storageKey='theme' themes={{ sepia: 'light' }}>
                <ThemeProbe />
            </FlippoProvider>
        );
        expect(document.documentElement.getAttribute('data-theme')).toBe('sepia');
        expect(screen.getByTestId('probe').textContent).toMatch(/^sepia sepia light/);
        act(() => screen.getByTestId('probe').click());
        expect(localStorage.getItem('theme')).toBe('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('renders the inline script that applies the stored theme before the first paint', () => {
        const { container } = render(<ThemeScript storageKey='theme' nonce='abc' />);
        const script = container.querySelector('script');
        expect(script?.getAttribute('nonce')).toBe('abc');
        localStorage.setItem('theme', 'dark');
        new Function(script?.textContent ?? '')();
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('follows the system outside a provider', () => {
        render(<ThemeProbe />);
        expect(screen.getByTestId('probe').textContent).toBe('system light light light,dark');
    });
});

describe('FlippoProvider: control size', () => {
    it('gives the controls the size of the subtree; a family default and a prop win', () => {
        render(
            <FlippoProvider size='small' defaults={{ checkbox: { size: 'large' } }}>
                <Button>Small</Button>
                <Button size='large'>Large</Button>
                <Checkbox.Label data-testid='label'>
                    <Checkbox.Root data-testid='box' />
                    Agree
                </Checkbox.Label>
            </FlippoProvider>
        );
        expect(screen.getByText('Small').className).toContain('fl-button--small');
        expect(screen.getByText('Large').className).toContain('fl-button--large');
        expect(screen.getByTestId('label').className).toContain('fl-choice-label--large');
        expect(screen.getByTestId('box').className).toContain('fl-checkbox-root--large');
    });

    it('leaves families whose size is not a control size alone', () => {
        render(
            <FlippoProvider size='large'>
                <Dialog.Root open={true}>
                    <Dialog.Portal>
                        <Dialog.Popup data-testid='popup'>Dialog</Dialog.Popup>
                    </Dialog.Portal>
                </Dialog.Root>
            </FlippoProvider>
        );
        expect(screen.getByTestId('popup').className).not.toContain('--large');
    });

    it('reads the size grid, for the subtree and for a family', () => {
        render(
            <FlippoProvider size='small' defaults={{ select: { size: 'large' } }}>
                <SizeProbe />
                <SizeProbe family='select' />
                <SizeProbe family='dialog' />
            </FlippoProvider>
        );
        expect(JSON.parse(screen.getByTestId('size-global').textContent ?? '')).toEqual({ size: 'small', height: 40 });
        expect(JSON.parse(screen.getByTestId('size-select').textContent ?? '')).toEqual({
            size: 'large',
            height: 56,
            global: { size: 'small', height: 40 }
        });
        expect(JSON.parse(screen.getByTestId('size-dialog').textContent ?? '').size).toBe('small');
    });

    it('defaults to medium outside a provider', () => {
        render(<SizeProbe />);
        expect(JSON.parse(screen.getByTestId('size-global').textContent ?? '')).toEqual({ size: 'medium', height: 48 });
    });
});
