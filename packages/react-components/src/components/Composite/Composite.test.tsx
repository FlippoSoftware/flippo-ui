import React from 'react';

import { act, createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { ACTIVE_COMPOSITE_ITEM } from './constants';
import { CompositeItem } from './item/CompositeItem';
import { CompositeRoot } from './root/CompositeRoot';

describe.each(RENDER_MODES)('Composite ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function Items({ count = 3, disabled = [] as number[], active }: { count?: number; disabled?: number[]; active?: number }) {
        return (
            <React.Fragment>
                {Array.from({ length: count }, (_, index) => (
                    <CompositeItem
                        // biome-ignore lint/suspicious/noArrayIndexKey: static list
                        key={index}
                        tag='button'
                        props={[{ disabled: disabled.includes(index), [ACTIVE_COMPOSITE_ITEM]: active === index ? '' : undefined }]}
                    >
                        {`Item ${index}`}
                    </CompositeItem>
                ))}
            </React.Fragment>
        );
    }

    const item = (index: number) => screen.getByRole('button', { name: `Item ${index}` });

    async function settle() {
        await act(async () => {
            await Promise.resolve();
        });
    }

    it('uses a roving tab index starting at the first item', async () => {
        render(
            <CompositeRoot orientation='horizontal'>
                <Items />
            </CompositeRoot>
        );
        await settle();
        expect(item(0)).toHaveAttribute('tabindex', '0');
        expect(item(1)).toHaveAttribute('tabindex', '-1');
        expect(item(0).parentElement).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('moves with the arrow keys of its orientation and loops', async () => {
        const { user } = render(
            <CompositeRoot orientation='horizontal'>
                <Items />
            </CompositeRoot>
        );
        await settle();
        await user.tab();
        expect(item(0)).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(item(1)).toHaveFocus();
        expect(item(1)).toHaveAttribute('tabindex', '0');
        expect(item(0)).toHaveAttribute('tabindex', '-1');
        await user.keyboard('[ArrowDown]');
        expect(item(1)).toHaveFocus();
        await user.keyboard('[ArrowRight][ArrowRight]');
        expect(item(0)).toHaveFocus();
        await user.keyboard('[ArrowLeft]');
        expect(item(2)).toHaveFocus();
    });

    it('stops at the ends without loopFocus and supports Home/End', async () => {
        const { user } = render(
            <CompositeRoot orientation='vertical' loopFocus={false} enableHomeAndEndKeys={true}>
                <Items />
            </CompositeRoot>
        );
        await settle();
        await user.tab();
        await user.keyboard('[ArrowUp]');
        expect(item(0)).toHaveFocus();
        await user.keyboard('[End]');
        expect(item(2)).toHaveFocus();
        await user.keyboard('[ArrowDown]');
        expect(item(2)).toHaveFocus();
        await user.keyboard('[Home]');
        expect(item(0)).toHaveFocus();
    });

    it('skips disabled items', async () => {
        const { user } = render(
            <CompositeRoot orientation='horizontal'>
                <Items disabled={[1]} />
            </CompositeRoot>
        );
        await settle();
        await user.tab();
        await user.keyboard('[ArrowRight]');
        expect(item(2)).toHaveFocus();
    });

    it('navigates a grid', async () => {
        const { user } = render(
            <CompositeRoot cols={2}>
                <Items count={4} />
            </CompositeRoot>
        );
        await settle();
        await user.tab();
        await user.keyboard('[ArrowDown]');
        expect(item(2)).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(item(3)).toHaveFocus();
        await user.keyboard('[ArrowUp]');
        expect(item(1)).toHaveFocus();
    });

    it('starts at the active item and highlights hovered items', async () => {
        const { user } = render(
            <CompositeRoot orientation='horizontal' highlightItemOnHover={true}>
                <Items active={2} />
            </CompositeRoot>
        );
        await settle();
        expect(item(2)).toHaveAttribute('tabindex', '0');
        await user.hover(item(1));
        expect(item(1)).toHaveFocus();
    });

    it('follows a controlled highlighted index and reports the item map', async () => {
        const onHighlightedIndexChange = vi.fn();
        const onMapChange = vi.fn();
        const { user } = render(
            <CompositeRoot
                orientation='horizontal'
                highlightedIndex={1}
                onHighlightedIndexChange={onHighlightedIndexChange}
                onMapChange={onMapChange}
            >
                <Items />
            </CompositeRoot>
        );
        await settle();
        expect(item(1)).toHaveAttribute('tabindex', '0');
        expect(onMapChange).toHaveBeenLastCalledWith(expect.any(Map));
        expect((onMapChange.mock.lastCall?.[0] as Map<Element, unknown> | undefined)?.size).toBe(3);

        await user.click(item(2));
        expect(onHighlightedIndexChange).toHaveBeenCalledWith(2);
        expect(item(1)).toHaveAttribute('tabindex', '0');
    });
});
