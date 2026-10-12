import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Accordion } from '.';

describe.each(RENDER_MODES)('Accordion ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestAccordion(props: Partial<Accordion.Root.Props> & { disabledItem?: string }) {
        const { disabledItem, ...rootProps } = props;
        return (
            <Accordion.Root data-testid='root' {...rootProps}>
                {['one', 'two', 'three'].map((value) => (
                    <Accordion.Item key={value} value={value} data-testid={`item-${value}`} disabled={disabledItem === value}>
                        <Accordion.Header>
                            <Accordion.Trigger>{value}</Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel data-testid={`panel-${value}`}>{`${value} content`}</Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        );
    }

    const trigger = (name: string) => screen.getByRole('button', { name });

    it('renders a region with headings and labelled panels', async () => {
        const { user } = render(<TestAccordion />);
        expect(screen.getByTestId('root')).toHaveAttribute('role', 'region');
        expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
        expect(screen.getByTestId('item-two')).toHaveAttribute('data-index', '1');

        await user.click(trigger('one'));
        const panel = screen.getByTestId('panel-one');
        expect(panel).toHaveAttribute('role', 'region');
        expect(panel).toHaveAttribute('aria-labelledby', trigger('one').id);
        expect(trigger('one')).toHaveAttribute('aria-controls', panel.id);
        expect(trigger('one')).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByTestId('item-one')).toHaveAttribute('data-open', '');
        expect(panel.style.getPropertyValue('--accordion-panel-height')).toBe('auto');
    });

    it('keeps one item open at a time by default', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestAccordion onValueChange={onValueChange} />);
        await user.click(trigger('one'));
        await user.click(trigger('two'));
        expect(onValueChange).toHaveBeenLastCalledWith(['two'], expect.anything());
        expect(screen.queryByTestId('panel-one')).toBeNull();
        expect(screen.getByTestId('panel-two')).toBeInTheDocument();

        await user.click(trigger('two'));
        expect(onValueChange).toHaveBeenLastCalledWith([], expect.anything());
        expect(screen.queryByTestId('panel-two')).toBeNull();
    });

    it('opens several items with multiple', async () => {
        const { user } = render(<TestAccordion multiple={true} defaultValue={['one']} />);
        await user.click(trigger('three'));
        expect(screen.getByTestId('panel-one')).toBeInTheDocument();
        expect(screen.getByTestId('panel-three')).toBeInTheDocument();
        expect(screen.getByTestId('root')).toBeInTheDocument();
    });

    it('follows the controlled value and respects cancellation', async () => {
        const onValueChange = vi.fn();
        const { user, rerender } = render(<TestAccordion value={[]} onValueChange={onValueChange} />);
        await user.click(trigger('one'));
        expect(onValueChange).toHaveBeenCalledWith(['one'], expect.anything());
        expect(screen.queryByTestId('panel-one')).toBeNull();

        rerender(<TestAccordion value={['two']} onValueChange={onValueChange} />);
        expect(screen.getByTestId('panel-two')).toBeInTheDocument();

        rerender(<TestAccordion value={['two']} onValueChange={(_, details) => details.cancel()} />);
        await user.click(trigger('three'));
        expect(screen.queryByTestId('panel-three')).toBeNull();
    });

    it('moves focus between triggers with the keyboard', async () => {
        const { user } = render(<TestAccordion />);
        await user.tab();
        expect(trigger('one')).toHaveFocus();
        await user.keyboard('[ArrowDown]');
        expect(trigger('two')).toHaveFocus();
        await user.keyboard('[End]');
        expect(trigger('three')).toHaveFocus();
        await user.keyboard('[ArrowDown]');
        expect(trigger('one')).toHaveFocus();
        await user.keyboard('[ArrowUp]');
        expect(trigger('three')).toHaveFocus();
        await user.keyboard('[Home]');
        expect(trigger('one')).toHaveFocus();
    });

    it('does not loop with loopFocus={false} and uses left/right when horizontal', async () => {
        const { user } = render(<TestAccordion loopFocus={false} orientation='horizontal' />);
        await user.tab();
        await user.keyboard('[ArrowLeft]');
        expect(trigger('one')).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(trigger('two')).toHaveFocus();
        await user.keyboard('[ArrowDown]');
        expect(trigger('two')).toHaveFocus();
    });

    it('disables an item or the whole accordion', async () => {
        const { user, rerender } = render(<TestAccordion disabledItem='two' />);
        await user.click(trigger('two'));
        expect(screen.queryByTestId('panel-two')).toBeNull();
        expect(screen.getByTestId('item-two')).toHaveAttribute('data-disabled', '');

        rerender(<TestAccordion disabled={true} />);
        await user.click(trigger('one'));
        expect(screen.queryByTestId('panel-one')).toBeNull();
        expect(screen.getByTestId('root')).toHaveAttribute('data-disabled', '');
    });

    it('keeps closed panels in the DOM with hiddenUntilFound on the root', () => {
        render(<TestAccordion hiddenUntilFound={true} />);
        expect(screen.getByTestId('panel-one')).toHaveAttribute('hidden', 'until-found');
    });

    it('calls the item onOpenChange', async () => {
        const onOpenChange = vi.fn();
        const { user } = render(
            <Accordion.Root>
                <Accordion.Item value='a' onOpenChange={onOpenChange}>
                    <Accordion.Header>
                        <Accordion.Trigger>a</Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel>content</Accordion.Panel>
                </Accordion.Item>
            </Accordion.Root>
        );
        await user.click(trigger('a'));
        expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    });
});
