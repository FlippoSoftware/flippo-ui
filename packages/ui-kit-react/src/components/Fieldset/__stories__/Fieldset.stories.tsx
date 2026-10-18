import type * as React from 'react';

import { fieldset as recipe } from '@flippo-software/component-styles/fieldset';

import type { Meta, StoryObj } from '@storybook/react';

import { Field, Fieldset } from '~@src';
import { Card, Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Contacts(props: Props): React.JSX.Element {
    return (
        <Fieldset.Root {...props}>
            <Fieldset.Legend>{t('fieldset.content.authorSContacts')}</Fieldset.Legend>
            <Field.Root name='name'>
                <Field.Label>{t('fieldset.content.yourName')}</Field.Label>
                <Field.Control control='input' placeholder={t('common.egorGorochkin')} />
            </Field.Root>
            <Field.Root name='email'>
                <Field.Label>Email</Field.Label>
                <Field.Control control='input' type='email' placeholder='egor@flippo.app' />
                <Field.Description>{t('fieldset.content.forNotificationsAboutNew')}</Field.Description>
            </Field.Root>
        </Fieldset.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Contacts {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Fieldset',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: { docs: { description: { component: 'fieldset.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('fieldset.sections.fieldGroup.title')} description={t('fieldset.sections.fieldGroup.description')}>
                <div className='sb-grid' style={{ ['--sb-min' as string]: '320px' }}>
                    <Card>
                        <Contacts />
                    </Card>
                    <Card>
                        <Contacts disabled={true} />
                    </Card>
                </div>
            </Section>
        </Page>
    )
};
