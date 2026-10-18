import type * as React from 'react';

import { checkboxCard as recipe } from '@flippo-software/component-styles/checkbox-card';

import type { Meta, StoryObj } from '@storybook/react';

import { CheckboxCard, CheckboxGroup } from '~@src';
import { Grid, Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Option(props: Props & { title: string; text: string; value?: string; defaultChecked?: boolean }): React.JSX.Element {
    const { title, text, ...rest } = props;
    return (
        <CheckboxCard.Root {...rest}>
            <CheckboxCard.Indicator />
            <span style={{ display: 'grid', gap: 2 }}>
                <strong>{title}</strong>
                <span style={{ color: 'var(--fl-color-text-4)' }}>{text}</span>
            </span>
        </CheckboxCard.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Option {...args} title={t('common.hints')} text={t('checkboxCard.content.showAHintUnder')} />
        </div>
    );
}

const meta = {
    title: 'Forms/CheckboxCard',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'checkboxCard.description'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section
                title={t('checkboxCard.sections.indicatorPosition.title')}
                description={t('checkboxCard.sections.indicatorPosition.description')}
            >
                <Grid min={300}>
                    <Option title={t('common.hints')} text={t('checkboxCard.content.showAHintUnder')} defaultChecked={true} />
                    <Option title={t('checkboxCard.labels.details')} text={t('checkboxCard.content.anExplanationBlockAfter')} />
                    <Option
                        title={t('common.hints')}
                        text={t('checkboxCard.content.showAHintUnder')}
                        indicatorPosition='end'
                        defaultChecked={true}
                    />
                    <Option
                        title={t('checkboxCard.labels.details')}
                        text={t('checkboxCard.content.anExplanationBlockAfter')}
                        indicatorPosition='end'
                    />
                </Grid>
            </Section>
            <Section title={t('checkboxCard.sections.disabled.title')} description={t('checkboxCard.sections.disabled.description')}>
                <Grid min={300}>
                    <Option title={t('checkboxCard.labels.voiceOver')} text={t('checkboxCard.content.comingSoon')} disabled={true} />
                    <Option
                        title={t('checkboxCard.labels.sync')}
                        text={t('checkboxCard.content.turnedOnByThe')}
                        disabled={true}
                        defaultChecked={true}
                    />
                </Grid>
            </Section>
            <Section title={t('checkboxCard.sections.group.title')} description={t('checkboxCard.sections.group.description')}>
                <CheckboxGroup defaultValue={['hints']} aria-label={t('checkboxCard.labels.cardBlocks')}>
                    <Grid min={240}>
                        <Option value='hints' title={t('common.hints')} text={t('checkboxCard.content.belowTheQuestion')} />
                        <Option value='details' title={t('checkboxCard.labels.details')} text={t('checkboxCard.content.afterTheAnswer')} />
                        <Option value='image' title={t('checkboxCard.labels.image')} text={t('checkboxCard.content.aboveTheQuestion')} />
                    </Grid>
                </CheckboxGroup>
            </Section>
        </Page>
    )
};
