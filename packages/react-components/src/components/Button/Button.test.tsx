import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Button } from './Button';

describe.each(RENDER_MODES)('Button ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    it('renders a native button and calls onClick', async () => {
        const onClick = vi.fn();
        const { user } = render(<Button onClick={onClick}>Save</Button>);
        const button = screen.getByRole('button', { name: 'Save' });
        expect(button.tagName).toBe('BUTTON');
        expect(button).toHaveAttribute('type', 'button');
        await user.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('ignores interaction and is not focusable when disabled', async () => {
        const onClick = vi.fn();
        const { user } = render(
            <Button disabled={true} onClick={onClick}>
                Save
            </Button>
        );
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('data-disabled', '');
        await user.click(button);
        await user.tab();
        expect(onClick).not.toHaveBeenCalled();
        expect(button).not.toHaveFocus();
    });

    it('stays focusable when disabled with focusableWhenDisabled', async () => {
        const onClick = vi.fn();
        const { user } = render(
            <Button disabled={true} focusableWhenDisabled={true} onClick={onClick}>
                Save
            </Button>
        );
        const button = screen.getByRole('button');
        expect(button).not.toBeDisabled();
        expect(button).toHaveAttribute('aria-disabled', 'true');
        await user.tab();
        expect(button).toHaveFocus();
        await user.keyboard('[Enter]');
        await user.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('activates a non-native button with Enter and Space', async () => {
        const onClick = vi.fn();
        const { user } = render(
            <Button nativeButton={false} render={<span />} onClick={onClick}>
                Save
            </Button>
        );
        const button = screen.getByRole('button');
        expect(button.tagName).toBe('SPAN');
        expect(button).toHaveAttribute('tabindex', '0');
        expect(button).not.toHaveAttribute('type');

        await user.tab();
        await user.keyboard('[Enter]');
        expect(onClick).toHaveBeenCalledTimes(1);
        await user.keyboard('[Space]');
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('disables a non-native button with aria-disabled', async () => {
        const onClick = vi.fn();
        const { user } = render(
            <Button nativeButton={false} render={<span />} disabled={true} onClick={onClick}>
                Save
            </Button>
        );
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).toHaveAttribute('tabindex', '-1');
        await user.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('forwards the ref and passes state to className', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Button ref={ref} disabled={true} className={(state) => (state.disabled ? 'off' : 'on')}>
                Save
            </Button>
        );
        expect(ref.current).toBe(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveClass('off');
    });
});
