import type * as React from 'react';

import { tabs as recipe } from '@flippo-software/component-styles/tabs';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Tabs } from '~@src';
import { Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

const FILTERS = (): [string, string, number, IconName][] => [
    ['all', t('tabs.content.all'), 7, 'set'],
    ['mine', t('common.mine'), 1, 'person-add'],
    ['free', t('common.free'), 4, 'star'],
    ['done', t('common.completed'), 0, 'check']
];

function Filters(props: Props & { withIcons?: boolean; withPanels?: boolean }): React.JSX.Element {
    const { withIcons = false, withPanels = false, ...rest } = props;
    return (
        <Tabs.Root {...rest} defaultValue='all'>
            <Tabs.List aria-label={t('common.cards')}>
                {FILTERS().map(([value, label, count, icon]) => (
                    <Tabs.Tab key={value} value={value} disabled={value === 'done'}>
                        {withIcons && <Icon name={icon} />}
                        {label}
                        <Tabs.Count>{count}</Tabs.Count>
                    </Tabs.Tab>
                ))}
                <Tabs.Indicator />
            </Tabs.List>
            {withPanels &&
                FILTERS().map(([value, label, count]) => (
                    <Tabs.Panel key={value} value={value}>
                        <p className='sb-section-text'>
                            {label}: {count} {t('tabs.content.cardsInTheSet')}
                        </p>
                    </Tabs.Panel>
                ))}
        </Tabs.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Filters {...args} withPanels={true} />
        </div>
    );
}

const meta = {
    title: 'Navigation/Tabs',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'tabs.description'
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
            <Section title='Line' description={t('tabs.sections.line.description')}>
                <Filters withPanels={true} />
            </Section>
            <Section title='Pill' description={t('tabs.sections.pill.description')}>
                <div className='sb-grid' style={{ ['--sb-min' as string]: '240px' }}>
                    {(['large', 'medium'] as const).map((size) => (
                        <Tabs.Root key={size} variant='pill' size={size} orientation='vertical' defaultValue='home'>
                            <Tabs.List aria-label={t('tabs.labels.sections')}>
                                <Tabs.Tab value='home'>
                                    <Icon name='home' />

                                    {t('tabs.content.home')}
                                </Tabs.Tab>
                                <Tabs.Tab value='community'>
                                    <Icon name='globe' />

                                    {t('common.community')}
                                </Tabs.Tab>
                                <Tabs.Tab value='collection'>
                                    <Icon name='folder' />

                                    {t('common.collection')}
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.Root>
                    ))}
                </div>
            </Section>
            <Section title='Filter' description={t('tabs.sections.filter.description')}>
                <Filters variant='filter' withIcons={true} />
                <Filters variant='filter' withIcons={true} stacked={true} />
            </Section>
        </Page>
    )
};
