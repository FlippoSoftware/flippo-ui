import type * as React from 'react';

import { code as recipe } from '@flippo-software/component-styles/code';

import type { Meta, StoryObj } from '@storybook/react';

import { Code, Text } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

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
    parameters: { docs: { description: { component: 'code.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('code.sections.variants.title')}>
                {(['soft', 'solid', 'outline', 'ghost'] as const).map((variant) => (
                    <Row key={variant} label={variant}>
                        <Code variant={variant}>npm run build</Code>
                    </Row>
                ))}
            </Section>
            <Section title={t('code.sections.sizes.title')}>
                <Row label='size'>
                    {(['1', '2', '3', '4', '5'] as const).map((size) => (
                        <Code key={size} size={size}>
                            map()
                        </Code>
                    ))}
                </Row>
            </Section>
            <Section title={t('code.sections.inAText.title')}>
                <Text>
                    {t('code.content.theMethod')} <Code>Array.prototype.map</Code> {t('code.content.returnsANewArray')} <Code>forEach</Code>{' '}
                    — <Code>undefined</Code>.
                </Text>
            </Section>
        </Page>
    )
};
