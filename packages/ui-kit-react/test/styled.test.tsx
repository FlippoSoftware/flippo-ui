import * as React from 'react';

import * as recipes from '@flippo-software/component-styles';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as Components from '../src';
import { Button, Card, Checkbox, Dialog, Field, Grid, Input, Text, Textarea } from '../src';

afterEach(cleanup);

describe('styled React components', () => {
    it('exports every shared component, including presentation components', () => {
        for (const [key] of Object.entries(recipes).filter(([, value]) => typeof value === 'function')) {
            const name = key === 'switchRecipe' ? 'Switch' : key[0]!.toUpperCase() + key.slice(1);
            expect(Components, name).toHaveProperty(name);
        }
    });
    it('merges state callbacks, preserves refs and updates button variants', () => {
        const ref = React.createRef<HTMLButtonElement>();
        const click = vi.fn();
        const { rerender } = render(
            <Button size='small' ref={ref} onClick={click} className={(state) => (state.disabled ? 'disabled' : 'custom')}>
                Save
            </Button>
        );
        expect(ref.current?.className).toContain('fl-button--small');
        expect(ref.current?.className).toContain('custom');
        fireEvent.click(ref.current!);
        expect(click).toHaveBeenCalledOnce();
        rerender(
            <Button size='large' disabled={true} ref={ref} onClick={click}>
                Save
            </Button>
        );
        expect(ref.current?.className).toContain('fl-button--large');
        expect(ref.current?.className).not.toContain('fl-button--small');
        fireEvent.click(ref.current!);
        expect(click).toHaveBeenCalledOnce();
    });
    it('retains checkbox behaviour and shares root variants with its parts', () => {
        render(
            <Checkbox.Root size='large' aria-label='Accept'>
                <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Root>
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox.className).toContain('fl-check');
        fireEvent.click(checkbox);
        expect(checkbox.getAttribute('aria-checked')).toBe('true');
        expect(screen.getByText('✓').className).toContain('fl-checkbox-indicator');
    });
    it('passes visual variants through a portal to the dialog popup', () => {
        const view = render(
            <Dialog.Root open={true} size='large'>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Popup>
                        <Dialog.Title>Details</Dialog.Title>
                        <Dialog.Description>Content</Dialog.Description>
                    </Dialog.Popup>
                </Dialog.Portal>
            </Dialog.Root>
        );
        const popup = screen.getByRole('dialog');
        expect(popup.className).toContain('fl-dialog-popup--large');
        expect(view.container.contains(popup)).toBe(false);
    });
    it('renders actual field controls, applies state to the input body and clears through Field', () => {
        const changed = vi.fn();
        render(
            <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input.Root defaultValue='Alice' onValueChange={changed} size='small'>
                    <Input.Body data-testid='body'>
                        <Input.Slot />
                        <Input.Clear />
                    </Input.Body>
                </Input.Root>
            </Field.Root>
        );
        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('Alice');
        expect(input.className).toContain('fl-input-control');
        expect(screen.getByTestId('body').className).toContain('fl-control--small');
        fireEvent.click(screen.getByRole('button', { name: 'Clear input' }));
        expect(input.value).toBe('');
        expect(changed).toHaveBeenCalled();
    });
    it('renders standalone Field.Control and multiline Textarea slots', () => {
        const { unmount } = render(
            <Field.Root>
                <Field.Control control='input' aria-label='Standalone' />
            </Field.Root>
        );
        expect(screen.getByRole('textbox').className).toContain('fl-control');
        unmount();
        render(
            <Field.Root>
                <Textarea.Root>
                    <Textarea.Body>
                        <Textarea.Slot aria-label='Message' />
                    </Textarea.Body>
                </Textarea.Root>
            </Field.Root>
        );
        expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
        expect(screen.getByRole('textbox').className).toContain('fl-textarea-control');
    });
    it('shares presentation recipes and layout tokens', () => {
        render(
            <Card.Root>
                <Card.Title>Title</Card.Title>
                <Card.Content>
                    <Text as='p' size='heading-2' color='brand'>
                        Hello
                    </Text>
                    <Grid.Root columns={3} spacing={4} data-testid='grid'>
                        <Grid.Item colSpan={2}>Cell</Grid.Item>
                    </Grid.Root>
                </Card.Content>
            </Card.Root>
        );
        expect(screen.getByText('Hello').className).toContain('fl-text-heading-2-default');
        expect(screen.getByText('Hello').tagName).toBe('P');
        expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('repeat(3, 1fr)');
        expect(screen.getByTestId('grid').style.gap).toBe('var(--fl-spacing-4)');
    });
});
