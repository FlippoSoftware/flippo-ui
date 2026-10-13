import type * as React from 'react';

import { navigationMenu as recipe } from '@flippo-software/component-styles/navigation-menu';

import type { Meta, StoryObj } from '@storybook/react';

import { NavigationMenu } from '~@src';
import { Page, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Site(props: Props): React.JSX.Element {
    return (
        <NavigationMenu.Root {...props}>
            <NavigationMenu.List>
                <NavigationMenu.Item value='learn'>
                    <NavigationMenu.Trigger>
                        Учиться
                        <NavigationMenu.Icon />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 220px))', gap: 4 }}>
                            <NavigationMenu.Link href='#sets'>
                                Наборы
                                <NavigationMenu.LinkDescription>Карточки по темам от сообщества</NavigationMenu.LinkDescription>
                            </NavigationMenu.Link>
                            <NavigationMenu.Link href='#repeat'>
                                Повторение
                                <NavigationMenu.LinkDescription>Интервальное повторение на сегодня</NavigationMenu.LinkDescription>
                            </NavigationMenu.Link>
                            <NavigationMenu.Link href='#exam'>
                                Проверь себя
                                <NavigationMenu.LinkDescription>Тест по всем карточкам набора</NavigationMenu.LinkDescription>
                            </NavigationMenu.Link>
                            <NavigationMenu.Link href='#stats'>
                                Статистика
                                <NavigationMenu.LinkDescription>Прогресс за неделю и месяц</NavigationMenu.LinkDescription>
                            </NavigationMenu.Link>
                        </div>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item value='create'>
                    <NavigationMenu.Trigger>
                        Создавать
                        <NavigationMenu.Icon />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                        <NavigationMenu.Link href='#new'>
                            Новый набор
                            <NavigationMenu.LinkDescription>С нуля или из шаблона</NavigationMenu.LinkDescription>
                        </NavigationMenu.Link>
                        <NavigationMenu.Link href='#import'>
                            Импорт
                            <NavigationMenu.LinkDescription>Из CSV, Anki или Quizlet</NavigationMenu.LinkDescription>
                        </NavigationMenu.Link>
                    </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <NavigationMenu.Link
                        href='#community'
                        className='fl-navigation-menu-trigger fl-interactive fl-focus-ring fl-text-body-minus-stronger'
                    >
                        Сообщество
                    </NavigationMenu.Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
            <NavigationMenu.Portal>
                <NavigationMenu.Positioner>
                    <NavigationMenu.Popup>
                        <NavigationMenu.Viewport />
                    </NavigationMenu.Popup>
                </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
        </NavigationMenu.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Site {...args} />
        </div>
    );
}

const meta = {
    title: 'Navigation/NavigationMenu',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'Навигация сайта: панель меняет размер под содержимое и сдвигает его в сторону, откуда пришёл курсор.'
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
            <Section title='Главная навигация' description='Наведите на «Учиться», затем на «Создавать»: панель подстраивает размер.'>
                <div style={{ minHeight: 260 }}>
                    <Site />
                </div>
            </Section>
        </Page>
    )
};
