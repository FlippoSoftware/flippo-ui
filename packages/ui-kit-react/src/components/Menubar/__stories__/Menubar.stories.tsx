import type * as React from 'react';

import { menubar as recipe } from '@flippo-software/component-styles/menubar';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Menu, Menubar } from '~@src';
import { Page, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function EditorMenus(props: Props): React.JSX.Element {
    return (
        <Menubar {...props} aria-label='Редактор набора'>
            <Menu.Root>
                <Menubar.Trigger>Набор</Menubar.Trigger>
                <Menu.Portal>
                    <Menu.Positioner>
                        <Menu.Popup>
                            <Menu.Item>
                                <Icon name='plus' />
                                Новая карточка
                                <Menu.ItemEnd>⌘N</Menu.ItemEnd>
                            </Menu.Item>
                            <Menu.Item>
                                <Icon name='copy' />
                                Дублировать набор
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item tone='destructive'>
                                <Icon name='delete' />
                                Удалить набор
                            </Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
            <Menu.Root>
                <Menubar.Trigger>Вид</Menubar.Trigger>
                <Menu.Portal>
                    <Menu.Positioner>
                        <Menu.Popup>
                            <Menu.CheckboxItem defaultChecked={true}>
                                Показывать подсказки
                                <Menu.CheckboxItemIndicator />
                            </Menu.CheckboxItem>
                            <Menu.CheckboxItem>
                                Компактные карточки
                                <Menu.CheckboxItemIndicator />
                            </Menu.CheckboxItem>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
            <Menu.Root>
                <Menubar.Trigger>Справка</Menubar.Trigger>
                <Menu.Portal>
                    <Menu.Positioner>
                        <Menu.Popup>
                            <Menu.Item>Горячие клавиши</Menu.Item>
                            <Menu.Item disabled={true}>Что нового</Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
        </Menubar>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <EditorMenus {...args} />
        </div>
    );
}

const meta = {
    title: 'Navigation/Menubar',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: { description: { component: 'Строка меню: открыв одно меню, можно переходить по соседним наведением или стрелками.' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Меню редактора' description='Пункты с иконками, сочетаниями клавиш, флажками и опасным действием.'>
                <EditorMenus />
            </Section>
        </Page>
    )
};
