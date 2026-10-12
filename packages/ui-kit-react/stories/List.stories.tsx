import * as React from 'react';

import { list as recipe } from '@flippo-software/component-styles/list';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, List } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { type?: 'ordered' | 'unordered' };

const STEPS = ['Создайте набор', 'Добавьте карточки', 'Пригласите участников', 'Начните повторение'];

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <List.Root {...args}>
                {STEPS.map((step) => (
                    <List.Item key={step}>
                        <List.Marker />
                        {step}
                    </List.Item>
                ))}
            </List.Root>
        </div>
    );
}

const meta = {
    title: 'Display/List',
    component: Example,
    args: { type: 'ordered' },
    argTypes: {
        ...variantControls(recipe),
        type: { control: 'inline-radio', options: ['ordered', 'unordered'], table: { category: 'Behaviour' } }
    },
    parameters: {
        docs: {
            description: {
                component:
                    'Список: маркеры (номера или точки) ставит сам компонент. Вложенный `List.Root` кладётся внутрь `List.Item`, а `List.Subheader` в том же пункте становится его подписью (`aria-labelledby`). `interactive` делает пункты кнопками.'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Folders(): React.JSX.Element {
    const [selected, setSelected] = React.useState('ux');
    const folders = [
        ['ux', 'Законы UX', '32'],
        ['js', 'JavaScript', '18'],
        ['en', 'Английский B2', '120'],
        ['archive', 'Архив', '0']
    ] as const;
    return (
        <List.Root type='unordered' style={{ inlineSize: '100%' }}>
            {folders.map(([id, name, count]) => (
                <List.Item
                    key={id}
                    interactive={true}
                    selected={selected === id}
                    disabled={id === 'archive'}
                    onClick={() => setSelected(id)}
                >
                    <Icon name='folder' />
                    <span style={{ flex: 1 }}>{name}</span>
                    <span className='sb-caption'>{count}</span>
                </List.Item>
            ))}
        </List.Root>
    );
}

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section
                title='Нумерованный и маркированный'
                description='Номера и точки компонент ставит сам — `List.Marker` без содержимого.'
            >
                <Row label='ordered'>
                    <Example type='ordered' />
                </Row>
                <Row label='unordered'>
                    <Example type='unordered' />
                </Row>
            </Section>
            <Section title='Вложенные списки с подзаголовками' description='Нумерация продолжается внутри каждого уровня.'>
                <List.Root>
                    <List.Item>
                        <List.Marker />
                        <List.Subheader>Законы UX</List.Subheader>
                        <List.Root>
                            {['Закон Хика', 'Закон Фиттса', 'Закон Миллера'].map((law) => (
                                <List.Item key={law}>
                                    <List.Marker />
                                    {law}
                                </List.Item>
                            ))}
                        </List.Root>
                    </List.Item>
                    <List.Item>
                        <List.Marker />
                        <List.Subheader>Гештальт</List.Subheader>
                        <List.Root type='unordered'>
                            {['Близость', 'Сходство', 'Замкнутость'].map((law) => (
                                <List.Item key={law}>
                                    <List.Marker />
                                    {law}
                                </List.Item>
                            ))}
                        </List.Root>
                    </List.Item>
                </List.Root>
            </Section>
            <Section title='Интерактивные пункты' description='Строки-кнопки: наведение, выбранный и недоступный пункт.'>
                <div className='sb-narrow'>
                    <Folders />
                </div>
            </Section>
            <Section title='Горизонтальный' description='`orientation="horizontal"` — пункты в строку с переносом.'>
                <List.Root type='unordered' orientation='horizontal'>
                    {['Дизайн', 'UX', 'Психология', 'Экзамен'].map((tag) => (
                        <List.Item key={tag}>
                            <List.Marker />
                            {tag}
                        </List.Item>
                    ))}
                </List.Root>
            </Section>
        </Page>
    )
};
