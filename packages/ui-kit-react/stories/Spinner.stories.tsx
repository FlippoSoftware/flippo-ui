import type * as React from 'react';

import { spinner as recipe } from '@flippo-software/component-styles/spinner';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Spinner } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Spinner {...args} aria-label='Загрузка' />
        </div>
    );
}

const meta = {
    title: 'Feedback/Spinner',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: { description: { component: 'Индикатор ожидания. `color="current"` берёт цвет текста — так спиннер встраивается в кнопки.' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const SIZES = ['x-small', 'small', 'medium', 'large'] as const;
const COLORS = ['brand', 'success', 'info', 'warning', 'danger', 'current'] as const;

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Размеры'>
                <Row label='size'>
                    {SIZES.map((size) => (
                        <Spinner key={size} size={size} aria-label={size} />
                    ))}
                </Row>
            </Section>
            <Section title='Цвета'>
                <Row label='color'>
                    {COLORS.map((color) => (
                        <Spinner key={color} color={color} aria-label={color} />
                    ))}
                </Row>
            </Section>
            <Section title='В кнопке' description='Кнопка в состоянии загрузки: спиннер цвета текста вместо иконки.'>
                <Row label='loading'>
                    <Button disabled={true}>
                        <Spinner size='x-small' color='current' aria-hidden={true} />
                        Сохраняем
                    </Button>
                    <Button variant='secondary' disabled={true}>
                        <Spinner size='x-small' color='current' aria-hidden={true} />
                        Загрузка
                    </Button>
                </Row>
            </Section>
        </Page>
    )
};
