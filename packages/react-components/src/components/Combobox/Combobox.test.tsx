import React from 'react';

import { createRenderer, screen, waitFor } from '@flippo/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { Autocomplete } from '../Autocomplete';
import { Field } from '../Field';
import { Form } from '../Form';

import { Combobox } from '.';

const fruits = ['Apple', 'Banana', 'Cherry', 'Grape'];

describe.each(RENDER_MODES)('Combobox ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestCombobox(props: Partial<Combobox.Root.Props<string, boolean>>) {
        return (
            <Combobox.Root items={fruits} {...(props as Combobox.Root.Props<string, boolean>)}>
                <Combobox.Input aria-label='Fruit' data-testid='input' />
                <Combobox.Trigger data-testid='trigger'>Open</Combobox.Trigger>
                <Combobox.Clear data-testid='clear'>Clear</Combobox.Clear>
                <Combobox.Portal>
                    <Combobox.Positioner>
                        <Combobox.Popup data-testid='popup'>
                            <Combobox.Empty data-testid='empty'>No fruits</Combobox.Empty>
                            <Combobox.List>
                                {(item: string) => (
                                    <Combobox.Item key={item} value={item}>
                                        <Combobox.ItemIndicator data-testid={`indicator-${item}`} />
                                        {item}
                                    </Combobox.Item>
                                )}
                            </Combobox.List>
                        </Combobox.Popup>
                    </Combobox.Positioner>
                </Combobox.Portal>
            </Combobox.Root>
        );
    }

    const input = () => screen.getByRole('combobox', { name: 'Fruit' });

    it('re-renders only the items whose highlight changes', async () => {
        const values = Array.from({ length: 20 }, (_, index) => `item-${index}`);
        const renders = new Set<string>();
        const { user } = render(
            <Combobox.Root items={values}>
                <Combobox.Input aria-label='Fruit' />
                <Combobox.Portal>
                    <Combobox.Positioner>
                        <Combobox.Popup>
                            <Combobox.List>
                                {(item: string) => (
                                    <Combobox.Item
                                        key={item}
                                        value={item}
                                        render={(props) => {
                                            renders.add(item);
                                            return <div {...props} />;
                                        }}
                                    >
                                        {item}
                                    </Combobox.Item>
                                )}
                            </Combobox.List>
                        </Combobox.Popup>
                    </Combobox.Positioner>
                </Combobox.Portal>
            </Combobox.Root>
        );
        await user.click(input());
        await user.keyboard('[ArrowDown]');
        await waitFor(() => expect(screen.getByRole('option', { name: 'item-0' })).toHaveAttribute('data-highlighted', ''));

        renders.clear();
        await user.keyboard('[ArrowDown]');
        expect(screen.getByRole('option', { name: 'item-1' })).toHaveAttribute('data-highlighted', '');
        expect([...renders].sort()).toEqual(['item-0', 'item-1']);
    });

    it('filters the items while typing', async () => {
        const onInputValueChange = vi.fn();
        const { user } = render(<TestCombobox onInputValueChange={onInputValueChange} />);
        await user.click(input());
        await user.keyboard('an');
        expect(onInputValueChange).toHaveBeenLastCalledWith('an', expect.anything());
        await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
        const options = screen.getAllByRole('option').map((option) => option.textContent);
        expect(options).toEqual(['Banana']);
        expect(input()).toHaveAttribute('aria-expanded', 'true');
    });

    it('selects an item with the keyboard and fills the input', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestCombobox onValueChange={onValueChange} />);
        await user.click(input());
        await user.keyboard('ch');
        await waitFor(() => expect(screen.getByRole('option', { name: 'Cherry' })).toBeInTheDocument());
        await user.keyboard('[ArrowDown]');
        expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('data-highlighted', '');
        expect(input()).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Cherry' }).id);
        await user.keyboard('[Enter]');
        expect(onValueChange).toHaveBeenLastCalledWith('Cherry', expect.anything());
        expect(input()).toHaveValue('Cherry');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    });

    it('selects an item with the pointer', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestCombobox onValueChange={onValueChange} />);
        await user.click(screen.getByTestId('trigger'));
        await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(4));
        await user.click(screen.getByRole('option', { name: 'Grape' }));
        expect(onValueChange).toHaveBeenLastCalledWith('Grape', expect.anything());
        expect(input()).toHaveValue('Grape');
    });

    it('shows the empty state', async () => {
        const { user } = render(<TestCombobox />);
        await user.click(input());
        await user.keyboard('zzz');
        await waitFor(() => expect(screen.getByTestId('empty')).toHaveTextContent('No fruits'));
        expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('closes on Escape', async () => {
        const { user } = render(<TestCombobox />);
        await user.click(input());
        await user.keyboard('a');
        await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    });

    it('selects multiple values', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestCombobox multiple={true} onValueChange={onValueChange} />);
        await user.click(screen.getByTestId('trigger'));
        await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(4));
        await user.click(screen.getByRole('option', { name: 'Apple' }));
        expect(onValueChange).toHaveBeenLastCalledWith(['Apple'], expect.anything());
        await user.click(screen.getByRole('option', { name: 'Grape' }));
        expect(onValueChange).toHaveBeenLastCalledWith(['Apple', 'Grape'], expect.anything());
        expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByTestId('indicator-Apple')).toBeInTheDocument();
    });

    it('follows the controlled value', () => {
        const { rerender } = render(<TestCombobox value='Banana' />);
        expect(input()).toHaveValue('Banana');
        rerender(<TestCombobox value='Grape' />);
        expect(input()).toHaveValue('Grape');
    });

    it('clears the value', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestCombobox defaultValue='Apple' onValueChange={onValueChange} />);
        expect(input()).toHaveValue('Apple');
        await user.click(screen.getByTestId('clear'));
        expect(onValueChange).toHaveBeenLastCalledWith(null, expect.anything());
        expect(input()).toHaveValue('');
    });

    it('submits its value with a form', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='fruit'>
                    <TestCombobox defaultValue='Cherry' />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onFormSubmit).toHaveBeenCalledWith({ fruit: 'Cherry' }, expect.anything());
    });

    it('works as an autocomplete', async () => {
        const onValueChange = vi.fn();
        const { user } = render(
            <Autocomplete.Root items={fruits} onValueChange={onValueChange}>
                <Autocomplete.Input aria-label='Search' />
                <Autocomplete.Portal>
                    <Autocomplete.Positioner>
                        <Autocomplete.Popup>
                            <Autocomplete.List>
                                {(item: string) => (
                                    <Autocomplete.Item key={item} value={item}>
                                        {item}
                                    </Autocomplete.Item>
                                )}
                            </Autocomplete.List>
                        </Autocomplete.Popup>
                    </Autocomplete.Positioner>
                </Autocomplete.Portal>
            </Autocomplete.Root>
        );
        const search = screen.getByRole('combobox', { name: 'Search' });
        await user.click(search);
        await user.keyboard('gr');
        await waitFor(() => expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Grape']));
        await user.click(screen.getByRole('option', { name: 'Grape' }));
        expect(search).toHaveValue('Grape');
        expect(onValueChange).toHaveBeenLastCalledWith('Grape', expect.anything());
    });
});
