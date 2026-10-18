import type * as React from 'react';

import { card as recipe } from '@flippo-software/component-styles/card';

import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, Button, Card, Icon, Progress } from '~@src';
import { Grid, Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function SetCard(props: Props & { title: string; count: number; learned: number }): React.JSX.Element {
    const { title, count, learned, ...rest } = props;
    return (
        <Card.Root {...rest}>
            <Card.Content>
                <span className='sb-caption' style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fl-color-set)' }}>
                    <Icon name='set' />
                    {count} {t('card.content.cards')}
                </span>
                <Card.Title>{title}</Card.Title>
                <Progress.Root value={Math.round((learned / count) * 100)} aria-label={t('card.labels.learned')}>
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
            </Card.Content>
            <Card.Footer>
                <Avatar.Root size='x-small'>
                    <Avatar.Fallback>{t('common.eg')}</Avatar.Fallback>
                </Avatar.Root>
                <span className='sb-caption' style={{ flex: 1 }}>
                    {learned} {t('card.content.of')} {count} {t('card.content.learned')}
                </span>
                <Button size='small'>{t('card.content.study')}</Button>
            </Card.Footer>
        </Card.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example sb-narrow'>
            <Card.Root {...args}>
                <Card.Content>
                    <Card.Title>{t('card.content.collaboration')}</Card.Title>
                    <Card.Description>{t('card.content.inviteFriendsToThe')}</Card.Description>
                </Card.Content>
                <Card.Footer>
                    <Button>
                        <Icon name='person-add' />

                        {t('common.invite')}
                    </Button>
                    <Button variant='label'>{t('card.content.later')}</Button>
                </Card.Footer>
            </Card.Root>
        </div>
    );
}

const meta = {
    title: 'Display/Card',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'card.description'
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
            <Section title={t('card.sections.callToAction.title')} description={t('card.sections.callToAction.description')}>
                <Example />
            </Section>
            <Section title={t('card.sections.gridOfSets.title')} description={t('card.sections.gridOfSets.description')}>
                <Grid min={240}>
                    <SetCard title={t('common.uxLawsExam')} count={32} learned={20} />
                    <SetCard title={t('card.labels.javascriptClosuresContextAnd')} count={18} learned={4} />
                    <SetCard title={t('common.englishB2')} count={120} learned={120} />
                </Grid>
            </Section>
        </Page>
    )
};
