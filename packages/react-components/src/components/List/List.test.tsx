import React from 'react';

import { createRenderer, screen } from '@flippo/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { List } from '.';

describe.each(RENDER_MODES)('List ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    it('renders an ordered list with numbered markers', async () => {
        render(
            <List.Root data-testid='root'>
                {['a', 'b', 'c'].map((value) => (
                    <List.Item key={value} data-testid={`item-${value}`}>
                        <List.Marker data-testid={`marker-${value}`} />
                        {value}
                    </List.Item>
                ))}
            </List.Root>
        );
        expect(screen.getByRole('list')).toBe(screen.getByTestId('root'));
        expect(screen.getByTestId('marker-a')).toHaveTextContent('1.');
        expect(screen.getByTestId('marker-c')).toHaveTextContent('3.');
        expect(screen.getByTestId('item-b')).toHaveAttribute('data-index', '1');
    });

    it('uses bullets for unordered lists and numbers nested lists', () => {
        render(
            <List.Root type='unordered'>
                <List.Item>
                    <List.Marker data-testid='marker' />
                    Parent
                    <List.Root data-testid='nested'>
                        <List.Item>
                            <List.Marker data-testid='nested-marker'>
                                {({ nestedListNumber, nestedListItemNumber, index }) =>
                                    `${nestedListNumber}:${nestedListItemNumber}:${index}`
                                }
                            </List.Marker>
                            Child
                        </List.Item>
                    </List.Root>
                </List.Item>
            </List.Root>
        );
        expect(screen.getByTestId('marker')).toHaveTextContent('•');
        expect(screen.getByTestId('nested')).toHaveAttribute('data-nested', '');
        expect(screen.getByTestId('nested-marker')).toHaveTextContent('2:1:0');
    });

    it('renders interactive items as buttons', async () => {
        const onClick = vi.fn();
        const { user } = render(
            <List.Root>
                <List.Item interactive={true} selected={true} onClick={onClick} data-testid='item'>
                    Item
                </List.Item>
                <List.Item interactive={true} disabled={true} onClick={onClick} data-testid='disabled'>
                    Disabled
                </List.Item>
            </List.Root>
        );
        const item = screen.getByTestId('item');
        expect(item).toHaveAttribute('role', 'button');
        expect(item).toHaveAttribute('aria-selected', 'true');
        await user.click(item);
        expect(onClick).toHaveBeenCalledTimes(1);
        await user.click(screen.getByTestId('disabled'));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('disabled')).toHaveAttribute('aria-disabled', 'true');
    });

    it('labels a nested list by its subheader', () => {
        render(
            <List.Root>
                <List.Item>
                    <List.Subheader>Fruits</List.Subheader>
                    <List.Root data-testid='nested'>
                        <List.Item>Apple</List.Item>
                    </List.Root>
                </List.Item>
            </List.Root>
        );
        expect(screen.getByTestId('nested')).toHaveAttribute('aria-labelledby', screen.getByText('Fruits').id);
    });
});
