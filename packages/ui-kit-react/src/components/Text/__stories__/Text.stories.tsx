import type * as React from 'react';

import { text as recipe } from '@flippo-software/component-styles/text';

import type { Meta, StoryObj } from '@storybook/react';

import { Text } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Text {...args}>{t('text.content.hickSLawDecision')}</Text>
        </div>
    );
}

const meta = {
    title: 'Typography/Text',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'text.description'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const SIZES = [
    'display-1',
    'display-2',
    'title-1',
    'title-2',
    'title-3',
    'heading-1',
    'heading-2',
    'heading-3',
    'body-plus',
    'body',
    'body-minus',
    'label'
] as const;
const COLORS = ['primary', 'secondary', 'tertiary', 'quaternary', 'disabled', 'brand', 'success', 'warning', 'error'] as const;

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('text.sections.scale.title')} description={t('text.sections.scale.description')}>
                {SIZES.map((size) => (
                    <Row key={size} label={size}>
                        <Text size={size} truncate={true}>
                            {t('common.uxLawsExam')}
                        </Text>
                    </Row>
                ))}
            </Section>
            <Section title={t('text.sections.weight.title')}>
                {(['weaker', 'default', 'stronger'] as const).map((weight) => (
                    <Row key={weight} label={weight}>
                        <Text size='body-plus' weight={weight}>
                            {t('text.content.reviewHardCardsMore')}
                        </Text>
                    </Row>
                ))}
            </Section>
            <Section title={t('text.sections.colours.title')}>
                <Row label='color'>
                    {COLORS.map((color) => (
                        <Text key={color} color={color}>
                            {color}
                        </Text>
                    ))}
                </Row>
            </Section>
            <Section title={t('text.sections.truncation.title')} description={t('text.sections.truncation.description')}>
                <div className='sb-narrow'>
                    <Text truncate={true}>{t('text.content.javascriptClosuresExecutionContext')}</Text>
                </div>
            </Section>
        </Page>
    )
};
