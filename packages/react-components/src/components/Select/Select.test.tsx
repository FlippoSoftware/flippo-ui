import React from 'react';

import { createRenderer, screen, waitFor } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { Field } from '../Field';
import { Form } from '../Form';

import { Select } from '.';

describe.each(RENDER_MODES)('Select ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    const fruits = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' }
    ];

    function TestSelect(props: Partial<Select.Root.Props<string, boolean>>) {
        return (
            <Select.Root items={fruits} {...(props as Select.Root.Props<string, boolean>)}>
                <Select.Trigger data-testid='trigger'>
                    <Select.Value data-testid='value' placeholder='Pick a fruit' />
                    <Select.Icon data-testid='icon' />
                </Select.Trigger>
                <Select.Portal>
                    <Select.Positioner data-testid='positioner' alignItemWithTrigger={false}>
                        <Select.Popup data-testid='popup'>
                            {fruits.map((fruit) => (
                                <Select.Item key={fruit.value} value={fruit.value}>
                                    <Select.ItemIndicator data-testid={`indicator-${fruit.value}`} />
                                    <Select.ItemText>{fruit.label}</Select.ItemText>
                                </Select.Item>
                            ))}
                        </Select.Popup>
                    </Select.Positioner>
                </Select.Portal>
            </Select.Root>
        );
    }

    const trigger = () => screen.getByTestId('trigger');

    it('renders a combobox trigger with the placeholder', () => {
        render(<TestSelect />);
        expect(trigger()).toHaveAttribute('role', 'combobox');
        expect(trigger()).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByTestId('value')).toHaveTextContent('Pick a fruit');
    });

    it('opens on click and selects an item', async () => {
        const onValueChange = vi.fn();
        const onOpenChange = vi.fn();
        const { user } = render(<TestSelect onValueChange={onValueChange} onOpenChange={onOpenChange} />);
        await user.click(trigger());
        await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
        expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());
        expect(trigger()).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getAllByRole('option')).toHaveLength(3);

        await user.click(screen.getByRole('option', { name: 'Banana' }));
        expect(onValueChange).toHaveBeenLastCalledWith('banana', expect.anything());
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(screen.getByTestId('value')).toHaveTextContent('Banana');
    });

    it('marks the selected item and shows its indicator', async () => {
        const { user } = render(<TestSelect defaultValue='cherry' />);
        expect(screen.getByTestId('value')).toHaveTextContent('Cherry');
        await user.click(trigger());
        await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
        const cherry = screen.getByRole('option', { name: 'Cherry' });
        expect(cherry).toHaveAttribute('aria-selected', 'true');
        expect(cherry).toHaveAttribute('data-selected', '');
        expect(screen.getByTestId('indicator-cherry')).toBeInTheDocument();
        expect(screen.queryByTestId('indicator-apple')).toBeNull();
    });

    it('navigates with the keyboard', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestSelect onValueChange={onValueChange} />);
        trigger().focus();
        await user.keyboard('[ArrowDown]');
        await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus());
        await user.keyboard('[ArrowDown]');
        expect(screen.getByRole('option', { name: 'Banana' })).toHaveFocus();
        await user.keyboard('[Enter]');
        expect(onValueChange).toHaveBeenLastCalledWith('banana', expect.anything());
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    });

    it('re-renders only the items whose highlight changes', async () => {
        const values = Array.from({ length: 20 }, (_, index) => `item-${index}`);
        const renders = new Set<string>();
        const { user } = render(
            <Select.Root items={values.map((value) => ({ value, label: value }))}>
                <Select.Trigger data-testid='trigger'>
                    <Select.Value placeholder='Pick' />
                </Select.Trigger>
                <Select.Portal>
                    <Select.Positioner alignItemWithTrigger={false}>
                        <Select.Popup>
                            {values.map((value) => (
                                <Select.Item
                                    key={value}
                                    value={value}
                                    render={(props) => {
                                        renders.add(value);
                                        return <div {...props} />;
                                    }}
                                >
                                    {value}
                                </Select.Item>
                            ))}
                        </Select.Popup>
                    </Select.Positioner>
                </Select.Portal>
            </Select.Root>
        );
        trigger().focus();
        await user.keyboard('[ArrowDown]');
        await waitFor(() => expect(screen.getByRole('option', { name: 'item-0' })).toHaveFocus());

        renders.clear();
        await user.keyboard('[ArrowDown]');
        expect(screen.getByRole('option', { name: 'item-1' })).toHaveFocus();
        expect([...renders].sort()).toEqual(['item-0', 'item-1']);
    });

    it('closes on Escape without changing the value', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestSelect defaultValue='apple' onValueChange={onValueChange} />);
        await user.click(trigger());
        await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.getByTestId('value')).toHaveTextContent('Apple');
    });

    it('follows the controlled value', () => {
        const { rerender } = render(<TestSelect value='apple' />);
        expect(screen.getByTestId('value')).toHaveTextContent('Apple');
        rerender(<TestSelect value='banana' />);
        expect(screen.getByTestId('value')).toHaveTextContent('Banana');
    });

    it('selects multiple values', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestSelect multiple={true} defaultValue={[]} onValueChange={onValueChange} />);
        await user.click(trigger());
        await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
        await user.click(screen.getByRole('option', { name: 'Apple' }));
        expect(onValueChange).toHaveBeenLastCalledWith(['apple'], expect.anything());
        // Multiple selects stay open.
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        await user.click(screen.getByRole('option', { name: 'Cherry' }));
        expect(onValueChange).toHaveBeenLastCalledWith(['apple', 'cherry'], expect.anything());
        expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('does not open when disabled', async () => {
        const { user } = render(<TestSelect disabled={true} />);
        await user.click(trigger());
        expect(screen.queryByRole('listbox')).toBeNull();
        expect(trigger()).toHaveAttribute('data-disabled', '');
    });

    it('submits its value with a form', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='fruit'>
                    <TestSelect defaultValue='banana' />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onFormSubmit).toHaveBeenCalledWith({ fruit: 'banana' }, expect.anything());
    });
});
