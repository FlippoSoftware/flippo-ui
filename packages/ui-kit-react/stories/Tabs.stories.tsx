import type * as React from 'react';

import { tabs as recipe } from '@flippo-software/component-styles/tabs';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Tabs } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

const FILTERS: [string, string, number, IconName][] = [
    ['all', 'Все', 7, 'set'],
    ['mine', 'Мои', 1, 'person-add'],
    ['free', 'Свободные', 4, 'star'],
    ['done', 'Готовые', 0, 'check']
];

function Filters(props: Props & { withIcons?: boolean; withPanels?: boolean }): React.JSX.Element {
    const { withIcons = false, withPanels = false, ...rest } = props;
    return (
        <Tabs.Root {...rest} defaultValue='all'>
            <Tabs.List aria-label='Карточки'>
                {FILTERS.map(([value, label, count, icon]) => (
                    <Tabs.Tab key={value} value={value} disabled={value === 'done'}>
                        {withIcons && <Icon name={icon} />}
                        {label}
                        <Tabs.Count>{count}</Tabs.Count>
                    </Tabs.Tab>
                ))}
                <Tabs.Indicator />
            </Tabs.List>
            {withPanels &&
                FILTERS.map(([value, label, count]) => (
                    <Tabs.Panel key={value} value={value}>
                        <p className='sb-section-text'>
                            {label}: {count} карточек в наборе «Экзамен Законы UX».
                        </p>
                    </Tabs.Panel>
                ))}
        </Tabs.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Filters {...args} withPanels={true} />
        </div>
    );
}

const meta = {
    title: 'Navigation/Tabs',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component:
                    'Вкладки (Figma "Tabs & Menu"): line — с подчёркиванием, которое переезжает к выбранной вкладке; pill — заливка выбранной; filter — чипы со счётчиком.'
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
            <Section title='Line' description='Figma "Horizontal Tab": разделы страницы с панелями под ними.'>
                <Filters withPanels={true} />
            </Section>
            <Section title='Pill' description='Figma "Vertical Tab": навигация в боковой панели, Large 56 и Medium 48.'>
                <div className='sb-grid' style={{ ['--sb-min' as string]: '240px' }}>
                    {(['large', 'medium'] as const).map((size) => (
                        <Tabs.Root key={size} variant='pill' size={size} orientation='vertical' defaultValue='home'>
                            <Tabs.List aria-label='Разделы'>
                                <Tabs.Tab value='home'>
                                    <Icon name='home' />
                                    Главная
                                </Tabs.Tab>
                                <Tabs.Tab value='community'>
                                    <Icon name='globe' />
                                    Сообщество
                                </Tabs.Tab>
                                <Tabs.Tab value='collection'>
                                    <Icon name='folder' />
                                    Коллекция
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.Root>
                    ))}
                </div>
            </Section>
            <Section title='Filter' description='Figma "Filter Tab": фильтры списка со счётчиком; stacked — иконка над подписью.'>
                <Filters variant='filter' withIcons={true} />
                <Filters variant='filter' withIcons={true} stacked={true} />
            </Section>
        </Page>
    )
};
