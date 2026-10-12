import React from 'react';

import { createRenderer, screen } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';
import { Field } from '../Field';
import { Form } from '../Form';

import { SegmentedControl } from '.';

describe.each(RENDER_MODES)('SegmentedControl ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestControl(props: Partial<SegmentedControl.Root.Props>) {
        return (
            <SegmentedControl.Root aria-label='View' data-testid='root' {...props}>
                <SegmentedControl.Item value='list'>List</SegmentedControl.Item>
                <SegmentedControl.Item value='grid'>Grid</SegmentedControl.Item>
            </SegmentedControl.Root>
        );
    }

    const item = (name: string) => screen.getByRole('radio', { name });

    it('selects the clicked item', async () => {
        const onValueChange = vi.fn();
        const { user } = render(<TestControl defaultValue='list' onValueChange={onValueChange} />);
        expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'horizontal');
        expect(item('List')).toHaveAttribute('aria-checked', 'true');
        expect(item('List')).toHaveAttribute('data-selected', '');

        await user.click(item('Grid'));
        expect(onValueChange).toHaveBeenCalledWith('grid', expect.anything());
        expect(item('Grid')).toHaveAttribute('aria-checked', 'true');
        expect(item('List')).toHaveAttribute('data-unselected', '');
    });

    it('roves focus with the arrow keys', async () => {
        const { user } = render(<TestControl defaultValue='grid' />);
        await user.tab();
        expect(item('Grid')).toHaveFocus();
        await user.keyboard('[ArrowRight]');
        expect(item('List')).toHaveFocus();
    });

    it('follows the controlled value and ignores a read-only control', async () => {
        const { user, rerender } = render(<TestControl value='list' />);
        await user.click(item('Grid'));
        expect(item('List')).toHaveAttribute('aria-checked', 'true');
        rerender(<TestControl value='grid' />);
        expect(item('Grid')).toHaveAttribute('aria-checked', 'true');

        const onValueChange = vi.fn();
        rerender(<TestControl defaultValue='grid' readOnly={true} onValueChange={onValueChange} />);
        await user.click(item('List'));
        expect(onValueChange).not.toHaveBeenCalled();
        expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
    });

    it('submits the selected value with a form', async () => {
        const onFormSubmit = vi.fn();
        const { user } = render(
            <Form onFormSubmit={onFormSubmit}>
                <Field.Root name='view'>
                    <TestControl defaultValue='list' />
                </Field.Root>
                <button type='submit'>Submit</button>
            </Form>
        );
        await user.click(item('Grid'));
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onFormSubmit).toHaveBeenCalledWith({ view: 'grid' }, expect.anything());
    });
});
