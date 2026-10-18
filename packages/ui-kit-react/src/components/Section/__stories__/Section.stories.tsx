import type * as React from 'react';

import { section as recipe } from '@flippo-software/component-styles/section';

import type { Meta, StoryObj } from '@storybook/react';

import { Section, Text } from '~@src';
import { Section as KitSection, Page, Resizable, Row, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example' style={{ inlineSize: '100%' }}>
            <Resizable>
                <Section {...args} className='story-surface'>
                    <Text size='heading-3'>{t('section.content.mySets')}</Text>
                    <Text color='tertiary'>{t('section.content.theVerticalPaddingOf')}</Text>
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
    parameters: { docs: { description: { component: 'section.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <KitSection title={t('section.labels.sizes')} description={t('section.content.theHeightOfThe')}>
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
