import type * as React from 'react';

import { spinner as recipe } from '@flippo-software/component-styles/spinner';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Spinner } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Spinner {...args} aria-label={t('common.loading')} />
        </div>
    );
}

const meta = {
    title: 'Feedback/Spinner',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: { description: { component: 'spinner.description' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const SIZES = ['x-small', 'small', 'medium', 'large'] as const;
const COLORS = ['brand', 'success', 'info', 'warning', 'danger', 'current'] as const;

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('spinner.sections.sizes.title')}>
                <Row label='size'>
                    {SIZES.map((size) => (
                        <Spinner key={size} size={size} aria-label={size} />
                    ))}
                </Row>
            </Section>
            <Section title={t('spinner.sections.colours.title')}>
                <Row label='color'>
                    {COLORS.map((color) => (
                        <Spinner key={color} color={color} aria-label={color} />
                    ))}
                </Row>
            </Section>
            <Section title={t('spinner.sections.inAButton.title')} description={t('spinner.sections.inAButton.description')}>
                <Row label='loading'>
                    <Button disabled={true}>
                        <Spinner size='x-small' color='current' aria-hidden={true} />

                        {t('spinner.content.saving')}
                    </Button>
                    <Button variant='secondary' disabled={true}>
                        <Spinner size='x-small' color='current' aria-hidden={true} />

                        {t('common.loading')}
                    </Button>
                </Row>
            </Section>
        </Page>
    )
};
