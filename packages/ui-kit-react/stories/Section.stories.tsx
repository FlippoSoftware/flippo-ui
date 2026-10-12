import type * as React from 'react';

import { section as recipe } from '@flippo-software/component-styles/section';

import type { Meta, StoryObj } from '@storybook/react';

import { Section, Text } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Section as KitSection, Page, Resizable, Row } from './kit';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example' style={{ inlineSize: '100%' }}>
            <Resizable>
                <Section {...args} className='story-surface'>
                    <Text size='heading-3'>Мои наборы</Text>
                    <Text color='tertiary'>Вертикальные отступы секции берутся из общей шкалы.</Text>
                </Section>
            </Resizable>
        </div>
    );
}

const meta = {
    title: 'Layout/Section',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'Секция страницы: вертикальные отступы sm–xl между крупными блоками.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <KitSection title='Размеры' description='Высота полосы — отступы секции.'>
                <Resizable>
                    {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                        <Row key={size} label={size} fill={true}>
                            <Section size={size} className='story-surface'>
                                <Text size='body-minus'>size="{size}"</Text>
                            </Section>
                        </Row>
                    ))}
                </Resizable>
            </KitSection>
        </Page>
    )
};
