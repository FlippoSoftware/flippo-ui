import type * as React from 'react';

import { blockquote as recipe } from '@flippo-software/component-styles/blockquote';

import type { Meta, StoryObj } from '@storybook/react';

import { Blockquote } from '~@src';
import { Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

const TEXT = 'Пользователи проводят большую часть времени на других сайтах и ожидают, что ваш будет работать так же.';

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example sb-medium'>
            <Blockquote {...args}>{TEXT}</Blockquote>
        </div>
    );
}

const meta = {
    title: 'Typography/Blockquote',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'Цитата-абзац с акцентной чертой слева. Три размера и цвета черты.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Цвета' description='Закон Якоба.'>
                {(['primary', 'brand', 'success', 'warning', 'error'] as const).map((color) => (
                    <Row key={color} label={color} fill={true}>
                        <Blockquote color={color}>{TEXT}</Blockquote>
                    </Row>
                ))}
            </Section>
            <Section title='Размеры'>
                {(['1', '2', '3'] as const).map((size) => (
                    <Row key={size} label={size} fill={true}>
                        <Blockquote size={size}>{TEXT}</Blockquote>
                    </Row>
                ))}
            </Section>
        </Page>
    )
};
