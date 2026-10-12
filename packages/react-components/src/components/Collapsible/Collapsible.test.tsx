import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Collapsible } from '.';

describe.each(RENDER_MODES)('Collapsible ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestCollapsible(props: Partial<Collapsible.Root.Props> & { panel?: Partial<Collapsible.Panel.Props> }) {
        const { panel, ...rootProps } = props;
        return (
            <Collapsible.Root data-testid='root' {...rootProps}>
                <Collapsible.Trigger>Toggle</Collapsible.Trigger>
                <Collapsible.Panel data-testid='panel' {...panel}>
                    Content
                </Collapsible.Panel>
            </Collapsible.Root>
        );
    }

    it('starts closed and opens from the trigger', async () => {
        const { user } = render(<TestCollapsible />);
        const trigger = screen.getByRole('button', { name: 'Toggle' });
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).not.toHaveAttribute('aria-controls');
        expect(screen.queryByTestId('panel')).toBeNull();
        expect(screen.getByTestId('root')).toHaveAttribute('data-closed', '');

        await user.click(trigger);
        const panel = screen.getByTestId('panel');
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(trigger).toHaveAttribute('aria-controls', panel.id);
        expect(trigger).toHaveAttribute('data-panel-open', '');
        expect(panel).toHaveAttribute('data-open', '');
        expect(panel).not.toHaveAttribute('hidden');
        expect(screen.getByTestId('root')).toHaveAttribute('data-open', '');
        expect(panel.style.getPropertyValue('--collapsible-panel-height')).toBe('auto');

        await user.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByTestId('panel')).toBeNull();
    });

    it('starts open with defaultOpen and uses a custom panel id', () => {
        render(<TestCollapsible defaultOpen={true} panel={{ id: 'details' }} />);
        expect(screen.getByTestId('panel')).toHaveAttribute('id', 'details');
        expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'details');
    });

    it('calls onOpenChange and respects cancellation', async () => {
        const onOpenChange = vi.fn((_open: boolean, details: Collapsible.Root.ChangeEventDetails) => details.cancel());
        const { user } = render(<TestCollapsible onOpenChange={onOpenChange} />);
        await user.click(screen.getByRole('button'));
        expect(onOpenChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: 'trigger-press' }));
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('follows the controlled open prop', async () => {
        const onOpenChange = vi.fn();
        const { user, rerender } = render(<TestCollapsible open={false} onOpenChange={onOpenChange} />);
        await user.click(screen.getByRole('button'));
        expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
        expect(screen.queryByTestId('panel')).toBeNull();

        rerender(<TestCollapsible open={true} onOpenChange={onOpenChange} />);
        expect(screen.getByTestId('panel')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('ignores the trigger when disabled', async () => {
        const { user } = render(<TestCollapsible disabled={true} />);
        const trigger = screen.getByRole('button');
        expect(trigger).toHaveAttribute('data-disabled', '');
        await user.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps a closed panel mounted but hidden with keepMounted', async () => {
        const { user } = render(<TestCollapsible panel={{ keepMounted: true }} />);
        const panel = screen.getByTestId('panel');
        expect(panel).toHaveAttribute('hidden');
        expect(panel).toHaveAttribute('data-closed', '');
        await user.click(screen.getByRole('button'));
        expect(screen.getByTestId('panel')).not.toHaveAttribute('hidden');
    });

    it('keeps the panel in the DOM with hiddenUntilFound', () => {
        render(<TestCollapsible panel={{ hiddenUntilFound: true }} />);
        expect(screen.getByTestId('panel')).toHaveAttribute('hidden', 'until-found');
    });

    it('renders only the children when the root has render={null}', () => {
        render(
            <Collapsible.Root render={null} defaultOpen={true}>
                <Collapsible.Trigger>Toggle</Collapsible.Trigger>
                <Collapsible.Panel data-testid='panel'>Content</Collapsible.Panel>
            </Collapsible.Root>
        );
        expect(screen.getByTestId('panel').parentElement).toBe(screen.getByRole('button').parentElement);
    });
});
