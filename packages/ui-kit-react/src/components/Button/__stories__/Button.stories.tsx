import type * as React from 'react';

import { button as recipe } from '@flippo-software/component-styles/button';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon } from '~@src';
import { Card, Grid, Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const VARIANTS = ['primary', 'secondary', 'outlined', 'label', 'danger'] as const;
const SIZES = ['large', 'medium', 'small', 'x-small'] as const;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Button {...args}>
                <Icon name='plus' />

                {t('common.createASet')}
            </Button>
        </div>
    );
}

const meta = {
    title: 'Actions/Button',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'button.description'
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
            <Section title={t('button.sections.variants.title')} description={t('button.sections.variants.description')}>
                {VARIANTS.map((variant) => (
                    <Row key={variant} label={variant}>
                        <Button variant={variant}>
                            <Icon name='plus' />

                            {t('button.content.button')}
                        </Button>
                        <Button variant={variant}>
                            {t('button.content.next')}
                            <Icon name='chevron-right' />
                        </Button>
                        <Button variant={variant} iconOnly={true} aria-label={t('button.labels.add')}>
                            <Icon name='plus' />
                        </Button>
                        <Button variant={variant} disabled={true}>
                            {t('common.disabled')}
                        </Button>
                    </Row>
                ))}
            </Section>
            <Section title={t('button.sections.sizes.title')} description={t('button.sections.sizes.description')}>
                {SIZES.map((size) => (
                    <Row key={size} label={size}>
                        <Button size={size}>
                            <Icon name='plus' />

                            {t('common.createASet')}
                        </Button>
                        <Button size={size} variant='secondary'>
                            {t('common.cancel')}
                        </Button>
                        <Button size={size} variant='secondary' iconOnly={true} aria-label={t('button.labels.settings')}>
                            <Icon name='settings' />
                        </Button>
                        <Button size={size} variant='label' iconOnly={true} aria-label={t('button.labels.more')}>
                            <Icon name='dots-vertical' />
                        </Button>
                    </Row>
                ))}
            </Section>
            <Section title={t('button.sections.states.title')} description={t('button.sections.states.description')}>
                <Row label='loading'>
                    <Button loading={true}>{t('button.content.saving')}</Button>
                    <Button variant='secondary' loading={true}>
                        {t('common.loading')}
                    </Button>
                </Row>
                <Row label='link'>
                    <Button href='#set' variant='outlined'>
                        {t('common.openTheSet')}
                        <Icon name='arrow-outward' />
                    </Button>
                </Row>
            </Section>
        </Page>
    )
};

export const Examples: Story = {
    render: () => (
        <Page>
            <Section title={t('button.sections.inAnInterface.title')} description={t('button.sections.inAnInterface.description')}>
                <Grid min={300}>
                    <Card caption={t('button.content.emptyCollection')}>
                        <p className='sb-section-text'>{t('button.content.youHaveNoSets')}</p>
                        <div className='sb-items'>
                            <Button>
                                <Icon name='plus' />

                                {t('common.createASet')}
                            </Button>
                            <Button variant='outlined'>{t('button.content.upload')}</Button>
                        </div>
                    </Card>
                    <Card caption={t('button.content.confirmation')}>
                        <p className='sb-section-text'>{t('button.content.deleteUxLawsExam')}</p>
                        <div className='sb-items'>
                            <Button variant='label'>{t('common.cancel')}</Button>
                            <Button variant='danger'>
                                <Icon name='delete' />

                                {t('common.delete')}
                            </Button>
                        </div>
                    </Card>
                    <Card caption={t('button.content.cardToolbar')}>
                        <div className='sb-items'>
                            <Button size='small' variant='secondary'>
                                <Icon name='hint' />

                                {t('button.content.addAHint')}
                            </Button>
                            <Button size='small' variant='secondary'>
                                <Icon name='bookmark' />
                                {t('common.markAsDone')}
                            </Button>
                            <Button size='small' variant='label' iconOnly={true} aria-label={t('button.labels.more')}>
                                <Icon name='dots-horizontal' />
                            </Button>
                        </div>
                    </Card>
                </Grid>
            </Section>
        </Page>
    )
};
