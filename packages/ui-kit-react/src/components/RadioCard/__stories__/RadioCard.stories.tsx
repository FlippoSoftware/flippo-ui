import type * as React from 'react';

import { radioCard as recipe } from '@flippo-software/component-styles/radio-card';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Icon, RadioCard, RadioGroup } from '~@src';
import { Grid, Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const MODES = (): [string, IconName, string, string][] => [
    ['all', 'set', t('common.allCards'), t('radioCard.content.inSetOrder')],
    ['shuffle', 'shuffle', t('radioCard.content.shuffled'), t('radioCard.content.randomOrder')],
    ['hard', 'star', t('common.hardOnes'), t('radioCard.content.onlyMarkedOnes')]
];

function Modes(props: Props & { disabled?: boolean }): React.JSX.Element {
    return (
        <RadioGroup defaultValue='shuffle' aria-label={t('common.reviewMode')} disabled={props.disabled}>
            <Grid min={220}>
                {MODES().map(([value, icon, title, text]) => (
                    <RadioCard.Root key={value} value={value} indicatorPosition={props.indicatorPosition}>
                        <RadioCard.Indicator />
                        <span style={{ display: 'grid', gap: 2 }}>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon name={icon} />
                                {title}
                            </strong>
                            <span style={{ color: 'var(--fl-color-text-4)' }}>{text}</span>
                        </span>
                    </RadioCard.Root>
                ))}
            </Grid>
        </RadioGroup>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Modes {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/RadioCard',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: { description: { component: 'radioCard.description' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section
                title={t('radioCard.sections.indicatorAtTheStart.title')}
                description={t('radioCard.sections.indicatorAtTheStart.description')}
            >
                <Modes />
            </Section>
            <Section
                title={t('radioCard.sections.indicatorAtTheEnd.title')}
                description={t('radioCard.sections.indicatorAtTheEnd.description')}
            >
                <Modes indicatorPosition='end' />
            </Section>
            <Section title={t('radioCard.sections.disabled.title')} description={t('radioCard.sections.disabled.description')}>
                <Modes disabled={true} />
            </Section>
        </Page>
    )
};
