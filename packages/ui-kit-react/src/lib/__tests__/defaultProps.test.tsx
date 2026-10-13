import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Button, DefaultPropsProvider, Input, Text } from '~@src';

import type { DefaultProps } from '~@src';

afterEach(cleanup);

describe('DefaultPropsProvider', () => {
    it('gives a family its default props; a prop set on the component wins', () => {
        render(
            <DefaultPropsProvider defaults={{ button: { size: 'small', variant: 'secondary' } }}>
                <Button>Default</Button>
                <Button size='large'>Large</Button>
            </DefaultPropsProvider>
        );
        expect(screen.getByText('Default').className).toContain('fl-button--small');
        expect(screen.getByText('Default').className).toContain('fl-button--secondary');
        expect(screen.getByText('Large').className).toContain('fl-button--large');
        expect(screen.getByText('Large').className).toContain('fl-button--secondary');
    });

    it('passes the root variants down and gives a part its own entry', () => {
        render(
            <DefaultPropsProvider defaults={{ input: { size: 'small', body: { appearance: 'inverted' } } }}>
                <Input.Root defaultValue='Alice'>
                    <Input.Body data-testid='body'>
                        <Input.Slot />
                    </Input.Body>
                </Input.Root>
            </DefaultPropsProvider>
        );
        const body = screen.getByTestId('body');
        expect(body.className).toContain('fl-control--small');
        expect(body.className).toContain('fl-control--inverted');
    });

    it('merges nested providers, part entries included', () => {
        render(
            <DefaultPropsProvider defaults={{ button: { size: 'small' }, input: { body: { appearance: 'inverted' } } }}>
                <DefaultPropsProvider defaults={{ button: { variant: 'danger' }, input: { size: 'large' } }}>
                    <Button>Nested</Button>
                    <Input.Root>
                        <Input.Body data-testid='body'>
                            <Input.Slot />
                        </Input.Body>
                    </Input.Root>
                </DefaultPropsProvider>
            </DefaultPropsProvider>
        );
        expect(screen.getByText('Nested').className).toContain('fl-button--small');
        expect(screen.getByText('Nested').className).toContain('fl-button--danger');
        expect(screen.getByTestId('body').className).toContain('fl-control--large');
        expect(screen.getByTestId('body').className).toContain('fl-control--inverted');
    });

    it('gives presentation components their default props', () => {
        render(
            <DefaultPropsProvider defaults={{ text: { color: 'brand' } }}>
                <Text>Brand</Text>
            </DefaultPropsProvider>
        );
        expect(screen.getByText('Brand').className).toContain('fl-text--brand');
    });

    it('types the families, their props and their parts', () => {
        const defaults: DefaultProps = { select: { size: 'small', positioner: { sideOffset: 4 } } };
        // @ts-expect-error: not a size of the button
        const wrongSize: DefaultProps = { button: { size: 'huge' } };
        // @ts-expect-error: not a family of the kit
        const wrongFamily: DefaultProps = { table: {} };
        expect([defaults, wrongSize, wrongFamily]).toHaveLength(3);
    });
});
