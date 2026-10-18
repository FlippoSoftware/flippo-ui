import type * as React from 'react';

import { field as recipe } from '@flippo-software/component-styles/field';

import type { Meta, StoryObj } from '@storybook/react';

import { Field } from '~@src';
import { Grid, Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean; invalid?: boolean };

function TitleField(props: Props & { defaultValue?: string; description?: string; error?: string }): React.JSX.Element {
    const {
        description = t('field.content.visibleToEveryMember'),
        error = t('field.content.theNameCannotBe'),
        defaultValue,
        ...rest
    } = props;
    return (
        <Field.Root {...rest} name='title'>
            <Field.Label>{t('common.setName')}</Field.Label>
            <Field.Control control='input' placeholder={t('field.placeholders.uxLawsSay')} defaultValue={defaultValue} />
            <Field.Description>{description}</Field.Description>
            <Field.Error match={rest.invalid ? true : undefined}>{error}</Field.Error>
        </Field.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <TitleField {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Field',
    component: Example,
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        invalid: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    parameters: {
        docs: {
            description: {
                component: 'field.description'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true } };

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('field.sections.states.title')} description={t('field.sections.states.description')}>
                <Grid min={300}>
                    <TitleField defaultValue={t('common.uxLawsExam')} />
                    <TitleField invalid={true} />
                    <TitleField disabled={true} defaultValue={t('common.uxLawsExam')} description={t('field.content.onlyTheOwnerCan')} />
                </Grid>
            </Section>
            <Section title={t('field.sections.sizes.title')} description={t('field.sections.sizes.description')}>
                <Grid min={300}>
                    <TitleField size='large' defaultValue='Large' />
                    <TitleField size='medium' defaultValue='Medium' />
                    <TitleField size='small' defaultValue='Small' />
                </Grid>
            </Section>
            <Section title={t('field.sections.onACard.title')} description={t('field.sections.onACard.description')} raised={true}>
                <Grid min={300}>
                    <TitleField appearance='inverted' />
                    <TitleField appearance='inverted' invalid={true} />
                </Grid>
            </Section>
        </Page>
    )
};
