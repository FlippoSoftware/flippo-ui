import type * as React from 'react';

import { code as recipe } from '@flippo-software/component-styles/code';

import type { Meta, StoryObj } from '@storybook/react';

import { Code, Text } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Code {...args}>useToastManager()</Code>
        </div>
    );
}

const meta = {
    title: 'Typography/Code',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'Код внутри текста: моноширинный шрифт и подложка. Размер 1–9 и четыре варианта.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Варианты'>
                {(['soft', 'solid', 'outline', 'ghost'] as const).map((variant) => (
                    <Row key={variant} label={variant}>
                        <Code variant={variant}>npm run build</Code>
                    </Row>
                ))}
            </Section>
            <Section title='Размеры'>
                <Row label='size'>
                    {(['1', '2', '3', '4', '5'] as const).map((size) => (
                        <Code key={size} size={size}>
                            map()
                        </Code>
                    ))}
                </Row>
            </Section>
            <Section title='В тексте'>
                <Text>
                    Метод <Code>Array.prototype.map</Code> возвращает новый массив, а <Code>forEach</Code> — <Code>undefined</Code>.
                </Text>
            </Section>
        </Page>
    )
};
