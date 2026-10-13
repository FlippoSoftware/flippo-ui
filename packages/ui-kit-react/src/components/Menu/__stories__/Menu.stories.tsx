import * as React from 'react';

import { menu as recipe } from '@flippo-software/component-styles/menu';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon, Menu } from '~@src';
import { Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function CardMenu(props: Props & { onAction?: (action: string) => void }): React.JSX.Element {
    const { onAction = () => undefined, ...rest } = props;
    return (
        <Menu.Root {...rest}>
            <Menu.Trigger render={<Button variant='label' iconOnly={true} aria-label='Действия с карточкой' />}>
                <Icon name='dots-vertical' />
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Positioner>
                    <Menu.Popup>
                        <Menu.Item onClick={() => onAction('Редактирование')}>
                            <Icon name='pencil' />
                            Редактировать
                            <Menu.ItemEnd>E</Menu.ItemEnd>
                        </Menu.Item>
                        <Menu.Item onClick={() => onAction('Дублирование')}>
                            <Icon name='copy' />
                            Дублировать
                        </Menu.Item>
                        <Menu.Item onClick={() => onAction('Назначение')}>
                            <Icon name='person-add' />
                            Назначить себе
                        </Menu.Item>
                        <Menu.Item disabled={true}>
                            <Icon name='bookmark' />В список готовых
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item tone='destructive' onClick={() => onAction('Удаление')}>
                            <Icon name='delete' />
                            Удалить
                        </Menu.Item>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    const [action, setAction] = React.useState('');
    return (
        <div className='story-example'>
            <CardMenu {...args} onAction={setAction} />
            <output aria-live='polite' className='sb-caption'>
                {action}
            </output>
        </div>
    );
}

const meta = {
    title: 'Overlays/Menu',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component:
                    'Меню действий (Figma "Menu Item"): обычные и опасные пункты, флажки, переключатели, группы и вложенные меню. Подсветка следует за курсором и стрелками.'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function ViewMenu(): React.JSX.Element {
    const [sort, setSort] = React.useState('recent');
    return (
        <Menu.Root>
            <Menu.Trigger render={<Button variant='secondary' />}>
                Вид
                <Icon name='chevron-down' />
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Positioner>
                    <Menu.Popup>
                        <Menu.Group>
                            <Menu.GroupLabel>Показывать</Menu.GroupLabel>
                            <Menu.CheckboxItem defaultChecked={true}>
                                Подсказки
                                <Menu.CheckboxItemIndicator />
                            </Menu.CheckboxItem>
                            <Menu.CheckboxItem>
                                Пустые карточки
                                <Menu.CheckboxItemIndicator />
                            </Menu.CheckboxItem>
                        </Menu.Group>
                        <Menu.Separator />
                        <Menu.Group>
                            <Menu.GroupLabel>Сортировка</Menu.GroupLabel>
                            <Menu.RadioGroup value={sort} onValueChange={setSort}>
                                <Menu.RadioItem value='recent'>
                                    Недавние
                                    <Menu.RadioItemIndicator />
                                </Menu.RadioItem>
                                <Menu.RadioItem value='alpha'>
                                    По алфавиту
                                    <Menu.RadioItemIndicator />
                                </Menu.RadioItem>
                            </Menu.RadioGroup>
                        </Menu.Group>
                        <Menu.Separator />
                        <Menu.SubmenuRoot>
                            <Menu.SubmenuTrigger>
                                <Icon name='folder' />
                                Переместить в папку
                                <Menu.ItemEnd>
                                    <Icon name='chevron-right' />
                                </Menu.ItemEnd>
                            </Menu.SubmenuTrigger>
                            <Menu.Portal>
                                <Menu.Positioner>
                                    <Menu.Popup>
                                        <Menu.Item>Саморазвитие</Menu.Item>
                                        <Menu.Item>2 семестр</Menu.Item>
                                    </Menu.Popup>
                                </Menu.Positioner>
                            </Menu.Portal>
                        </Menu.SubmenuRoot>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
}

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Действия' description='Иконки, сочетание клавиш, недоступный и опасный пункты.'>
                <Row label='card menu'>
                    <CardMenu />
                </Row>
            </Section>
            <Section title='Флажки, выбор и вложенное меню' description='Группы с заголовками, CheckboxItem, RadioGroup и подменю.'>
                <Row label='view'>
                    <ViewMenu />
                </Row>
            </Section>
        </Page>
    )
};
