import React from 'react';

import { act, createRenderer, screen } from '@flippo/internal-test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Avatar } from '.';

/**
 * Stand-in for `window.Image`: jsdom never loads images, so tests settle them by hand.
 */
class FakeImage {
    static instances: FakeImage[] = [];

    onload: (() => void) | null = null;

    onerror: (() => void) | null = null;

    src = '';

    crossOrigin: string | null = null;

    referrerPolicy = '';

    constructor() {
        FakeImage.instances.push(this);
    }

    static settle(src: string, result: 'load' | 'error') {
        act(() => {
            for (const image of FakeImage.instances.filter((instance) => instance.src === src)) {
                (result === 'load' ? image.onload : image.onerror)?.();
            }
        });
    }
}

describe.each(RENDER_MODES)('Avatar ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    beforeEach(() => {
        FakeImage.instances = [];
        vi.stubGlobal('Image', FakeImage);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    function TestAvatar(props: { src?: string; delay?: number; onLoadingStatusChange?: (status: string) => void }) {
        return (
            <Avatar.Root data-testid='root'>
                <Avatar.Image alt='User' src={props.src} onLoadingStatusChange={props.onLoadingStatusChange} />
                <Avatar.Fallback delay={props.delay}>UN</Avatar.Fallback>
            </Avatar.Root>
        );
    }

    it('shows the fallback while the image loads and the image once loaded', () => {
        render(<TestAvatar src='/a.png' />);
        expect(screen.queryByRole('img')).toBeNull();
        expect(screen.getByText('UN')).toBeInTheDocument();

        FakeImage.settle('/a.png', 'load');
        expect(screen.getByRole('img', { name: 'User' })).toHaveAttribute('src', '/a.png');
        expect(screen.queryByText('UN')).toBeNull();
    });

    it('keeps the fallback when the image fails or has no src', () => {
        const { rerender } = render(<TestAvatar src='/broken.png' />);
        FakeImage.settle('/broken.png', 'error');
        expect(screen.queryByRole('img')).toBeNull();
        expect(screen.getByText('UN')).toBeInTheDocument();

        rerender(<TestAvatar />);
        expect(screen.queryByRole('img')).toBeNull();
        expect(screen.getByText('UN')).toBeInTheDocument();
    });

    it('reports loading status changes', () => {
        const onLoadingStatusChange = vi.fn();
        render(<TestAvatar src='/a.png' onLoadingStatusChange={onLoadingStatusChange} />);
        expect(onLoadingStatusChange).toHaveBeenLastCalledWith('loading');
        FakeImage.settle('/a.png', 'load');
        expect(onLoadingStatusChange).toHaveBeenLastCalledWith('loaded');
        expect(onLoadingStatusChange).not.toHaveBeenCalledWith('idle');
    });

    it('loads the new image when src changes', () => {
        const { rerender } = render(<TestAvatar src='/a.png' />);
        FakeImage.settle('/a.png', 'load');
        rerender(<TestAvatar src='/b.png' />);
        expect(screen.queryByRole('img')).toBeNull();
        FakeImage.settle('/b.png', 'load');
        expect(screen.getByRole('img')).toHaveAttribute('src', '/b.png');
    });

    it('delays the fallback', () => {
        vi.useFakeTimers();
        render(<TestAvatar src='/a.png' delay={200} />);
        expect(screen.queryByText('UN')).toBeNull();
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(screen.getByText('UN')).toBeInTheDocument();
    });

    it('does not expose the loading status as a data attribute', () => {
        render(<TestAvatar src='/a.png' />);
        FakeImage.settle('/a.png', 'load');
        const root = screen.getByTestId('root');
        expect(root.tagName).toBe('SPAN');
        expect([...root.attributes].map((attribute) => attribute.name)).not.toContain('data-image-loading-status');
    });
});
