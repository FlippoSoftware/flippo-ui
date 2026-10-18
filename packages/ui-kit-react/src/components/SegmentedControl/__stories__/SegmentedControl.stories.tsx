import type * as React from 'react';

import { segmentedControl as recipe } from '@flippo-software/component-styles/segmented-control';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, SegmentedControl } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Period(props: Props): React.JSX.Element {
    return (
        <SegmentedControl.Root defaultValue='week' aria-label={t('segmentedControl.labels.statisticsPeriod')} {...props}>
            <SegmentedControl.Item value='day'>{t('common.day')}</SegmentedControl.Item>
            <SegmentedControl.Item value='week'>{t('common.week')}</SegmentedControl.Item>
            <SegmentedControl.Item value='month'>{t('common.month')}</SegmentedControl.Item>
            <SegmentedControl.Item value='year' disabled={true}>
                {t('segmentedControl.content.year')}
            </SegmentedControl.Item>
        </SegmentedControl.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Period {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/SegmentedControl',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: { docs: { description: { component: 'segmentedControl.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('segmentedControl.sections.sizes.title')} description={t('segmentedControl.sections.sizes.description')}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Period size={size} />
                    </Row>
                ))}
            </Section>
            <Section
                title={t('segmentedControl.sections.withIconsAndDisabled.title')}
                description={t('segmentedControl.sections.withIconsAndDisabled.description')}
            >
                <Row label='icons'>
                    <SegmentedControl.Root defaultValue='cards' aria-label={t('common.view')}>
                        <SegmentedControl.Item value='list'>
                            <Icon name='format-list-ul' />

                            {t('common.list')}
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value='cards'>
                            <Icon name='set' />

                            {t('common.cards')}
                        </SegmentedControl.Item>
                    </SegmentedControl.Root>
                </Row>
                <Row label='disabled'>
                    <Period disabled={true} />
                </Row>
            </Section>
        </Page>
    )
};
