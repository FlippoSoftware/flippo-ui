import type * as React from 'react';

import { toolbar as recipe } from '@flippo-software/component-styles/toolbar';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Toggle, ToggleGroup, Toolbar } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

function Editor(props: Props): React.JSX.Element {
    return (
        <Toolbar.Root {...props} aria-label='Форматирование карточки'>
            <ToggleGroup multiple={true} aria-label='Начертание'>
                <Toolbar.Button render={<Toggle value='bold' aria-label='Жирный' />}>
                    <Icon name='format-bold' />
                </Toolbar.Button>
                <Toolbar.Button render={<Toggle value='italic' aria-label='Курсив' />}>
                    <Icon name='format-italic' />
                </Toolbar.Button>
                <Toolbar.Button render={<Toggle value='underline' aria-label='Подчёркнутый' />}>
                    <Icon name='format-underline' />
                </Toolbar.Button>
            </ToggleGroup>
            <Toolbar.Separator />
            <Toolbar.Group aria-label='Блоки'>
                <Toolbar.Button>
                    <Icon name='hint' />
                    Подсказка
                </Toolbar.Button>
                <Toolbar.Button>
                    <Icon name='format-list-ul' />
                    Список
                </Toolbar.Button>
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Link href='#help'>Справка</Toolbar.Link>
        </Toolbar.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Editor {...args} />
        </div>
    );
}

const meta = {
    title: 'Navigation/Toolbar',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'Панель инструментов: один шаг Tab, дальше стрелки; кнопки, переключатели, ссылки и поле в одной строке.'
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
            <Section title='Редактор карточки' description='Переключатели начертания, кнопки блоков и ссылка, разделённые линиями.'>
                <Editor />
            </Section>
            <Section title='С поиском' description='Поле в панели инструментов — небольшое inverted.'>
                <Toolbar.Root aria-label='Набор'>
                    <Toolbar.Button>
                        <Icon name='plus' />
                        Карточка
                    </Toolbar.Button>
                    <Toolbar.Button>
                        <Icon name='shuffle' />
                        Перемешать
                    </Toolbar.Button>
                    <Toolbar.Separator />
                    <Toolbar.Input aria-label='Поиск по карточкам' placeholder='Поиск по карточкам' />
                </Toolbar.Root>
            </Section>
        </Page>
    )
};
