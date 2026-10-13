import * as React from 'react';

import { form as recipe } from '@flippo-software/component-styles/form';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Field, Form, Icon, Switch } from '~@src';
import { Card, Page, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function NewSet(props: Props): React.JSX.Element {
    const [created, setCreated] = React.useState('');
    return (
        <Form
            {...props}
            onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                setCreated(String(data.get('title') ?? ''));
            }}
        >
            <Field.Root name='title'>
                <Field.Label>Название</Field.Label>
                <Field.Control control='input' required={true} placeholder='Например, Законы UX' />
                <Field.Error match='valueMissing'>Введите название набора</Field.Error>
            </Field.Root>
            <Field.Root name='description'>
                <Field.Label>Описание</Field.Label>
                <Field.Control control='input' placeholder='О чём этот набор' />
                <Field.Description>Необязательно</Field.Description>
            </Field.Root>
            <Switch.Label>
                <Switch.Root name='public' defaultChecked={true}>
                    <Switch.Thumb />
                </Switch.Root>
                Виден в сообществе
            </Switch.Label>
            <div className='sb-items'>
                <Button type='submit'>
                    <Icon name='plus' />
                    Создать набор
                </Button>
                <Button type='reset' variant='label'>
                    Сбросить
                </Button>
            </div>
            <output aria-live='polite' className='sb-caption'>
                {created ? `Создан набор «${created}»` : ''}
            </output>
        </Form>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <NewSet {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Form',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'Форма: колонка полей с отступом 24px; проверка полей показывается через Field.Error после отправки.'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Examples: Story = {
    render: () => (
        <Page>
            <Section title='Новый набор' description='Отправьте пустую форму, чтобы увидеть ошибку обязательного поля.'>
                <div className='sb-medium'>
                    <Card>
                        <NewSet />
                    </Card>
                </div>
            </Section>
        </Page>
    )
};
