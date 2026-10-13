import type * as React from 'react';

import { field as recipe } from '@flippo-software/component-styles/field';

import type { Meta, StoryObj } from '@storybook/react';

import { Field } from '~@src';
import { Grid, Page, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean; invalid?: boolean };

function TitleField(props: Props & { defaultValue?: string; description?: string; error?: string }): React.JSX.Element {
    const { description = 'Видно всем участникам набора', error = 'Название не может быть пустым', defaultValue, ...rest } = props;
    return (
        <Field.Root {...rest} name='title'>
            <Field.Label>Название набора</Field.Label>
            <Field.Control control='input' placeholder='Например, Законы UX' defaultValue={defaultValue} />
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
                component:
                    'Поле формы: подпись, контрол, описание и ошибка. Состояния (`data-invalid`, `data-disabled`, `data-focused`) приходят от Field и окрашивают все части.'
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
            <Section title='Состояния' description='Обычное, с ошибкой и недоступное.'>
                <Grid min={300}>
                    <TitleField defaultValue='Экзамен Законы UX' />
                    <TitleField invalid={true} />
                    <TitleField disabled={true} defaultValue='Экзамен Законы UX' description='Изменить может только владелец' />
                </Grid>
            </Section>
            <Section title='Размеры' description='Контрол поля принимает размеры и оформление Input.'>
                <Grid min={300}>
                    <TitleField size='large' defaultValue='Large' />
                    <TitleField size='medium' defaultValue='Medium' />
                    <TitleField size='small' defaultValue='Small' />
                </Grid>
            </Section>
            <Section title='На карточке' description='Inverted — для полей на поверхности bg-1.' raised={true}>
                <Grid min={300}>
                    <TitleField appearance='inverted' />
                    <TitleField appearance='inverted' invalid={true} />
                </Grid>
            </Section>
        </Page>
    )
};
