import type * as React from 'react';

import { link as recipe } from '@flippo-software/component-styles/link';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Link } from '~@src';
import { Card, Grid, Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Link {...args} href='#set'>
                <Icon name='plus' />

                {t('link.content.link')}
                <Icon name='arrow-outward' />
            </Link>
        </div>
    );
}

const meta = {
    title: 'Actions/Link',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'link.description'
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
            <Section title={t('link.sections.variants.title')} description={t('link.sections.variants.description')}>
                {(['neutral', 'branded'] as const).map((variant) => (
                    <Row key={variant} label={variant}>
                        <Link variant={variant} href='#set'>
                            {t('link.content.link')}
                        </Link>
                        <Link variant={variant} href='#set'>
                            <Icon name='plus' />

                            {t('link.content.link')}
                            <Icon name='arrow-outward' />
                        </Link>
                        <Link variant={variant} href='#set'>
                            <Icon name='arrow-back' />

                            {t('link.content.backToTheCollection')}
                        </Link>
                        <Link variant={variant} underline={true} href='#set'>
                            {t('link.content.withAnUnderline')}
                        </Link>
                    </Row>
                ))}
            </Section>
            <Section title={t('link.sections.sizes.title')} description={t('link.sections.sizes.description')}>
                <Row label='small'>
                    <Link size='small' href='#set'>
                        {t('common.openTheSet')}
                        <Icon name='arrow-outward' />
                    </Link>
                </Row>
                <Row label='medium'>
                    <Link size='medium' href='#set'>
                        {t('common.openTheSet')}
                        <Icon name='arrow-outward' />
                    </Link>
                </Row>
                <Row label='inherit'>
                    <p className='sb-section-text'>
                        {t('link.content.readMoreAboutThe')}{' '}
                        <Link size='inherit' variant='branded' underline={true} href='#guide'>
                            {t('link.content.guide')}
                        </Link>
                        .
                    </p>
                </Row>
            </Section>
        </Page>
    )
};

export const Examples: Story = {
    render: () => (
        <Page>
            <Section title={t('link.sections.inAnInterface.title')} description={t('link.sections.inAnInterface.description')}>
                <Grid min={280}>
                    <Card caption={t('link.content.backNavigation')}>
                        <Link href='#collection'>
                            <Icon name='arrow-back' />

                            {t('common.collection')}
                        </Link>
                    </Card>
                    <Card caption={t('link.content.externalResource')}>
                        <p className='sb-section-text'>{t('link.content.theCourseMaterialsAre')}</p>
                        <Link variant='branded' href='#course'>
                            <Icon name='learn' />

                            {t('link.content.goToTheCourse')}
                            <Icon name='arrow-outward' />
                        </Link>
                    </Card>
                </Grid>
            </Section>
        </Page>
    )
};
