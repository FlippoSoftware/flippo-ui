import type * as React from 'react';

import { container as recipe } from '@flippo-software/component-styles/container';

import type { Meta, StoryObj } from '@storybook/react';

import { Container, Text } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Resizable, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example' style={{ inlineSize: '100%' }}>
            <Resizable>
                <Container {...args} className='story-surface'>
                    <Text>Контейнер ограничивает ширину содержимого и центрирует его на странице.</Text>
                </Container>
            </Resizable>
        </div>
    );
}

const meta = {
    title: 'Layout/Container',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'Колонка страницы: максимальная ширина по размеру `size` и боковые поля.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Размеры' description='Каждая полоса — контейнер своего размера.'>
                <Resizable>
                    {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
                        <Row key={size} label={size} fill={true}>
                            <Container size={size} className='story-surface'>
                                <Text size='body-minus'>size="{size}"</Text>
                            </Container>
                        </Row>
                    ))}
                </Resizable>
            </Section>
        </Page>
    )
};
