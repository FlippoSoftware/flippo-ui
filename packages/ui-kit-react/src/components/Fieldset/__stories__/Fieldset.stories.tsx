import type * as React from 'react';

import { fieldset as recipe } from '@flippo-software/component-styles/fieldset';

import type { Meta, StoryObj } from '@storybook/react';

import { Field, Fieldset } from '~@src';
import { Card, Page, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Contacts(props: Props): React.JSX.Element {
    return (
        <Fieldset.Root {...props}>
            <Fieldset.Legend>Контакты автора</Fieldset.Legend>
            <Field.Root name='name'>
                <Field.Label>Имя</Field.Label>
                <Field.Control control='input' placeholder='Егор Горочкин' />
            </Field.Root>
            <Field.Root name='email'>
                <Field.Label>Email</Field.Label>
                <Field.Control control='input' type='email' placeholder='egor@flippo.app' />
                <Field.Description>Для уведомлений о новых участниках</Field.Description>
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
    parameters: { docs: { description: { component: 'Группа полей с заголовком; `disabled` выключает все поля группы.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Группа полей' description='Обычная и недоступная.'>
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
