import * as React from 'react';

import { list as recipe } from '@flippo-software/component-styles/list';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, List } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { type?: 'ordered' | 'unordered' };

const STEPS = () => [
    t('list.content.createYourSet'),
    t('list.content.addCards'),
    t('list.content.inviteMembers'),
    t('list.content.startReviewing')
];

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <List.Root {...args}>
                {STEPS().map((step) => (
                    <List.Item key={step}>
                        <List.Marker />
                        {step}
                    </List.Item>
                ))}
            </List.Root>
        </div>
    );
}

const meta = {
    title: 'Display/List',
    component: Example,
    args: { type: 'ordered' },
    argTypes: {
        ...variantControls(recipe),
        type: { control: 'inline-radio', options: ['ordered', 'unordered'], table: { category: 'Behaviour' } }
    },
    parameters: {
        docs: {
            description: {
                component: 'list.description'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Folders(): React.JSX.Element {
    const [selected, setSelected] = React.useState('ux');
    const folders = [
        ['ux', t('common.uxLaws'), '32'],
        ['js', 'JavaScript', '18'],
        ['en', t('common.englishB2'), '120'],
        ['archive', t('list.content.archive'), '0']
    ] as const;
    return (
        <List.Root type='unordered' style={{ inlineSize: '100%' }}>
            {folders.map(([id, name, count]) => (
                <List.Item
                    key={id}
                    interactive={true}
                    selected={selected === id}
                    disabled={id === 'archive'}
                    onClick={() => setSelected(id)}
                >
                    <Icon name='folder' />
                    <span style={{ flex: 1 }}>{name}</span>
                    <span className='sb-caption'>{count}</span>
                </List.Item>
            ))}
        </List.Root>
    );
}

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('list.sections.numberedAndBulleted.title')} description={t('list.sections.numberedAndBulleted.description')}>
                <Row label='ordered'>
                    <Example type='ordered' />
                </Row>
                <Row label='unordered'>
                    <Example type='unordered' />
                </Row>
            </Section>
            <Section
                title={t('list.sections.nestedListsWithSubheaders.title')}
                description={t('list.sections.nestedListsWithSubheaders.description')}
            >
                <List.Root>
                    <List.Item>
                        <List.Marker />
                        <List.Subheader>{t('common.uxLaws')}</List.Subheader>
                        <List.Root>
                            {[t('common.hickSLaw'), t('common.fittsSLaw'), t('common.millerSLaw')].map((law) => (
                                <List.Item key={law}>
                                    <List.Marker />
                                    {law}
                                </List.Item>
                            ))}
                        </List.Root>
                    </List.Item>
                    <List.Item>
                        <List.Marker />
                        <List.Subheader>{t('list.content.gestalt')}</List.Subheader>
                        <List.Root type='unordered'>
                            {[t('list.content.proximity'), t('list.content.similarity'), t('list.content.closure')].map((law) => (
                                <List.Item key={law}>
                                    <List.Marker />
                                    {law}
                                </List.Item>
                            ))}
                        </List.Root>
                    </List.Item>
                </List.Root>
            </Section>
            <Section title={t('list.sections.interactiveItems.title')} description={t('list.sections.interactiveItems.description')}>
                <div className='sb-narrow'>
                    <Folders />
                </div>
            </Section>
            <Section title={t('list.sections.horizontal.title')} description={t('list.sections.horizontal.description')}>
                <List.Root type='unordered' orientation='horizontal'>
                    {[t('common.design'), 'UX', t('common.psychology'), t('list.content.exam')].map((tag) => (
                        <List.Item key={tag}>
                            <List.Marker />
                            {tag}
                        </List.Item>
                    ))}
                </List.Root>
            </Section>
        </Page>
    )
};
