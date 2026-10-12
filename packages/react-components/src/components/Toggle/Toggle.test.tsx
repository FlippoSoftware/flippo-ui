import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { ToggleGroup } from '../ToggleGroup';

import { Toggle } from './Toggle';

describe.each(RENDER_MODES)('Toggle ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    it('renders a native button that is not pressed by default', () => {
        render(<Toggle>Bold</Toggle>);
        const button = screen.getByRole('button', { name: 'Bold' });
        expect(button.tagName).toBe('BUTTON');
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(button).not.toHaveAttribute('data-pressed');
    });

    it('starts pressed with defaultPressed and toggles on click', async () => {
        const { user } = render(<Toggle defaultPressed={true}>Bold</Toggle>);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-pressed', 'true');
        expect(button).toHaveAttribute('data-pressed', '');

        await user.click(button);
        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(button).not.toHaveAttribute('data-pressed');

        await user.click(button);
        expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('toggles with the keyboard', async () => {
        const { user } = render(<Toggle>Bold</Toggle>);
        const button = screen.getByRole('button');
        await user.tab();
        expect(button).toHaveFocus();
        await user.keyboard('[Enter]');
        expect(button).toHaveAttribute('aria-pressed', 'true');
        await user.keyboard('[Space]');
        expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('calls onPressedChange with the next state and event details', async () => {
        const onPressedChange = vi.fn();
        const { user } = render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);
        await user.click(screen.getByRole('button'));
        expect(onPressedChange).toHaveBeenCalledTimes(1);
        const [pressed, details] = onPressedChange.mock.calls[0] ?? [];
        expect(pressed).toBe(true);
        expect(details.reason).toBe('none');
        expect(details.event).toBeInstanceOf(MouseEvent);
    });

    it('keeps the state when the change is canceled', async () => {
        const { user } = render(<Toggle onPressedChange={(_, details) => details.cancel()}>Bold</Toggle>);
        const button = screen.getByRole('button');
        await user.click(button);
        expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('follows the controlled pressed prop', async () => {
        const onPressedChange = vi.fn();
        const { user, rerender } = render(
            <Toggle pressed={false} onPressedChange={onPressedChange}>
                Bold
            </Toggle>
        );
        const button = screen.getByRole('button');

        await user.click(button);
        expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
        expect(button).toHaveAttribute('aria-pressed', 'false');

        rerender(
            <Toggle pressed={true} onPressedChange={onPressedChange}>
                Bold
            </Toggle>
        );
        expect(button).toHaveAttribute('aria-pressed', 'true');
        expect(button).toHaveAttribute('data-pressed', '');
    });

    it('works as a controlled component driven by state', async () => {
        function Controlled() {
            const [pressed, setPressed] = React.useState(false);
            return (
                <React.Fragment>
                    <Toggle pressed={pressed} onPressedChange={setPressed}>
                        Bold
                    </Toggle>
                    <output>{String(pressed)}</output>
                </React.Fragment>
            );
        }
        const { user } = render(<Controlled />);
        await user.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('status')).toHaveTextContent('true');
    });

    it('ignores interaction when disabled', async () => {
        const onPressedChange = vi.fn();
        const { user } = render(
            <Toggle disabled={true} onPressedChange={onPressedChange}>
                Bold
            </Toggle>
        );
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('data-disabled', '');
        await user.click(button);
        expect(onPressedChange).not.toHaveBeenCalled();
        expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('renders a non-native button with button semantics', async () => {
        const { user } = render(
            <Toggle nativeButton={false} render={<span />}>
                Bold
            </Toggle>
        );
        const button = screen.getByRole('button');
        expect(button.tagName).toBe('SPAN');
        expect(button).toHaveAttribute('tabindex', '0');
        await user.click(button);
        expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('passes state to className and render functions and forwards the ref', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Toggle defaultPressed={true} ref={ref} className={(state) => (state.pressed ? 'on' : 'off')}>
                Bold
            </Toggle>
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass('on');
        expect(ref.current).toBe(button);
    });

    it('lets an external onClick prevent the internal handler', async () => {
        const { user } = render(
            <Toggle onClick={(event) => (event as unknown as { preventHeadlessUIHandler: () => void }).preventHeadlessUIHandler()}>
                Bold
            </Toggle>
        );
        const button = screen.getByRole('button');
        await user.click(button);
        expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    describe('inside ToggleGroup', () => {
        it('reflects and updates the group value', async () => {
            const onValueChange = vi.fn();
            const { user } = render(
                <ToggleGroup defaultValue={['bold']} onValueChange={onValueChange}>
                    <Toggle value='bold'>Bold</Toggle>
                    <Toggle value='italic'>Italic</Toggle>
                </ToggleGroup>
            );
            const bold = screen.getByRole('button', { name: 'Bold' });
            const italic = screen.getByRole('button', { name: 'Italic' });
            expect(bold).toHaveAttribute('aria-pressed', 'true');
            expect(italic).toHaveAttribute('aria-pressed', 'false');

            await user.click(italic);
            expect(onValueChange).toHaveBeenLastCalledWith(['italic'], expect.anything());
            expect(italic).toHaveAttribute('aria-pressed', 'true');
            expect(bold).toHaveAttribute('aria-pressed', 'false');
        });

        it('moves focus with the arrow keys', async () => {
            const { user } = render(
                <ToggleGroup>
                    <Toggle value='bold'>Bold</Toggle>
                    <Toggle value='italic'>Italic</Toggle>
                </ToggleGroup>
            );
            await user.tab();
            expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
            await user.keyboard('[ArrowRight]');
            expect(screen.getByRole('button', { name: 'Italic' })).toHaveFocus();
        });

        it('is disabled by a disabled group', () => {
            render(
                <ToggleGroup disabled={true}>
                    <Toggle value='bold'>Bold</Toggle>
                </ToggleGroup>
            );
            expect(screen.getByRole('button')).toBeDisabled();
        });
    });
});
