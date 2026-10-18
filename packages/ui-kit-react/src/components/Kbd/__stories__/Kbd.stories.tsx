import type * as React from 'react';

import { kbd as recipe } from '@flippo-software/component-styles/kbd';

import type { Meta, StoryObj } from '@storybook/react';

import { Kbd, Text } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Kbd {...args}>⌘ K</Kbd>
        </div>
    );
}

const meta = {
    title: 'Typography/Kbd',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'kbd.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('kbd.sections.variants.title')}>
                {(['outline', 'soft', 'ghost'] as const).map((variant) => (
                    <Row key={variant} label={variant}>
                        <Kbd variant={variant}>Space</Kbd>
                        <Kbd variant={variant}>←</Kbd>
                        <Kbd variant={variant}>→</Kbd>
                    </Row>
                ))}
            </Section>
            <Section title={t('kbd.sections.sizes.title')}>
                <Row label='size'>
                    {(['1', '2', '3', '4', '5'] as const).map((size) => (
                        <Kbd key={size} size={size}>
                            Esc
                        </Kbd>
                    ))}
                </Row>
            </Section>
            <Section title={t('kbd.sections.reviewHint.title')}>
                <Text color='tertiary'>
                    <Kbd>Space</Kbd> {t('kbd.content.toFlipTheCard')} <Kbd>←</Kbd> {t('kbd.content.iDonTRemember')} <Kbd>→</Kbd>{' '}
                    {t('kbd.content.iRemember')}
                </Text>
            </Section>
        </Page>
    )
};
