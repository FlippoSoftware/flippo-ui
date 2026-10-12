import React from 'react';

import { createRenderer, screen } from '@flippo/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Tabs } from '.';

describe.each(RENDER_MODES)('Tabs ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestTabs(props: Partial<Tabs.Root.Props> & { activateOnFocus?: boolean; disabledTab?: string; keepMounted?: boolean }) {
        const { activateOnFocus, disabledTab, keepMounted, ...rootProps } = props;
        return (
            <Tabs.Root data-testid='root' defaultValue='one' {...rootProps}>
                <Tabs.List activateOnFocus={activateOnFocus}>
                    {['one', 'two', 'three'].map((value) => (
                        <Tabs.Tab key={value} value={value} disabled={disabledTab === value}>
                            {value}
                        </Tabs.Tab>
                    ))}
                    <Tabs.Indicator data-testid='indicator' />
                </Tabs.List>
                {['one', 'two', 'three'].map((value) => (
                    <Tabs.Panel key={value} value={value} keepMounted={keepMounted} data-testid={`panel-${value}`}>
                        {`${value} panel`}
                    </Tabs.Panel>
                ))}
            </Tabs.Root>
        );
    }

    const tab = (name: string) => screen.getByRole('tab', { name });

    it('links the tabs and panels and shows the selected panel', () => {
        render(<TestTabs />);
        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(tab('one')).toHaveAttribute('aria-selected', 'true');
        expect(tab('two')).toHaveAttribute('aria-selected', 'false');
        const panel = screen.getByRole('tabpanel');
        expect(panel).toHaveTextContent('one panel');
        expect(tab('one')).toHaveAttribute('aria-controls', panel.id);
        expect(panel).toHaveAttribute('aria-labelledby', tab('one').id);
        // Inactive panels stay in the DOM, hidden and empty.
        expect(screen.getByTestId('panel-two')).toHaveAttribute('hidden');
        expect(screen.getByTestId('panel-two')).toBeEmptyDOMElement();
    });

    it('selects the clicked tab', async () => {
        // jsdom has no layout: tabs are laid out left to right, 100px each.
        const positions: Record<string, number> = { one: 0, two: 100, three: 200 };
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
            const left = positions[this.textContent ?? ''] ?? 0;
            return DOMRect.fromRect({ x: left, y: 0, width: 100, height: 30 });
        });
        const onValueChange = vi.fn();
        const { user } = render(<TestTabs onValueChange={onValueChange} />);
        await user.click(tab('two'));
        expect(onValueChange).toHaveBeenCalledWith('two', expect.anything());
        expect(tab('two')).toHaveAttribute('aria-selected', 'true');
        expect(tab('two')).toHaveAttribute('data-active', '');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('two panel');
        expect(screen.getByTestId('root')).toHaveAttribute('data-activation-direction', 'right');
        vi.restoreAllMocks();
    });

    it('moves focus with the arrow keys and selects on Enter', async () => {
        const { user } = render(<TestTabs />);
        await user.tab();
        expect(tab('one')).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(tab('two')).toHaveFocus();
        expect(tab('one')).toHaveAttribute('aria-selected', 'true');
        await user.keyboard('[Enter]');
        expect(tab('two')).toHaveAttribute('aria-selected', 'true');
        await user.keyboard('[End]');
        expect(tab('three')).toHaveFocus();
        await user.keyboard('[Home]');
        expect(tab('one')).toHaveFocus();
    });

    it('selects on focus with activateOnFocus', async () => {
        const { user } = render(<TestTabs activateOnFocus={true} />);
        await user.tab();
        await user.keyboard('[ArrowRight]');
        expect(tab('two')).toHaveAttribute('aria-selected', 'true');
    });

    it('follows the controlled value', async () => {
        const { user, rerender } = render(<TestTabs value='one' />);
        await user.click(tab('three'));
        expect(tab('one')).toHaveAttribute('aria-selected', 'true');
        rerender(<TestTabs value='three' />);
        expect(tab('three')).toHaveAttribute('aria-selected', 'true');
    });

    it('does not select a disabled tab', async () => {
        const { user } = render(<TestTabs disabledTab='two' />);
        await user.click(tab('two'));
        expect(tab('one')).toHaveAttribute('aria-selected', 'true');
        expect(tab('two')).toHaveAttribute('data-disabled', '');
    });

    it('keeps inactive panels mounted but hidden with keepMounted', () => {
        render(<TestTabs keepMounted={true} />);
        expect(screen.getByTestId('panel-two')).toHaveAttribute('hidden');
        expect(screen.getByTestId('panel-two')).toHaveTextContent('two panel');
        expect(screen.getByTestId('panel-one')).not.toHaveAttribute('hidden');
    });

    it('renders the indicator with the active tab position', () => {
        render(<TestTabs />);
        const indicator = screen.getByTestId('indicator');
        expect(indicator).toHaveAttribute('data-orientation', 'horizontal');
        expect(indicator.style.getPropertyValue('--active-tab-width')).toBe('0px');
    });
});
