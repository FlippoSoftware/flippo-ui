import type * as React from 'react';

import { dialog as recipe } from '@flippo-software/component-styles/dialog';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Dialog, Field, Icon } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

function DeleteSet(props: Props): React.JSX.Element {
    return (
        <Dialog.Root {...props}>
            <Dialog.Trigger render={<Button variant='danger' />}>
                <Icon name='delete' />
                Удалить набор
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                    <Dialog.Title>Удалить набор?</Dialog.Title>
                    <Dialog.Description>
                        «Экзамен Законы UX» и 7 карточек исчезнут у всех участников. Это действие нельзя отменить.
                    </Dialog.Description>
                    <Dialog.Actions>
                        <Dialog.Close render={<Button variant='label' />}>Отмена</Dialog.Close>
                        <Dialog.Close render={<Button variant='danger' />}>Удалить</Dialog.Close>
                    </Dialog.Actions>
                    <Dialog.Close aria-label='Закрыть' />
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function RenameSet(props: Props): React.JSX.Element {
    return (
        <Dialog.Root {...props}>
            <Dialog.Trigger render={<Button variant='secondary' />}>
                <Icon name='pencil' />
                Переименовать
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                    <Dialog.Title>Новое название</Dialog.Title>
                    <Field.Root name='title'>
                        <Field.Label>Название набора</Field.Label>
                        <Field.Control control='input' defaultValue='Экзамен Законы UX' appearance='inverted' />
                    </Field.Root>
                    <Dialog.Actions>
                        <Dialog.Close render={<Button variant='label' />}>Отмена</Dialog.Close>
                        <Dialog.Close render={<Button />}>Сохранить</Dialog.Close>
                    </Dialog.Actions>
                    <Dialog.Close aria-label='Закрыть' />
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <DeleteSet {...args} />
        </div>
    );
}

const meta = {
    title: 'Overlays/Dialog',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component:
                    'Модальный диалог: подложка затемняет страницу и перехватывает нажатия — нажатие на неё закрывает диалог. Закрывается и по Escape; крестик — `Dialog.Close` без `render`.'
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
            <Section title='Подтверждение и форма' description='Опасное действие с подтверждением; короткая форма в диалоге.'>
                <Row label='confirm'>
                    <DeleteSet />
                </Row>
                <Row label='form'>
                    <RenameSet />
                </Row>
            </Section>
            <Section title='Размеры' description='Small 420, Medium 732, Large 1064 (по ширине окна на узких экранах).'>
                <Row label='sizes'>
                    <RenameSet size='small' />
                    <RenameSet size='medium' />
                    <RenameSet size='large' />
                </Row>
            </Section>
        </Page>
    )
};
