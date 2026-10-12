import { tabs as recipe } from '@flippo-software/component-styles/tabs';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { grid, icon, page, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

const FILTERS: [string, string, number, IconName][] = [
    ['all', 'Все', 7, 'set'],
    ['mine', 'Мои', 1, 'person-add'],
    ['free', 'Свободные', 4, 'star'],
    ['done', 'Готовые', 0, 'check']
];

function filters(attributes = '', options: { icons?: boolean; panels?: boolean } = {}): string {
    const tabs = FILTERS.map(
        ([value, label, count, name]) =>
            `<demo-tabs-tab value="${value}"${value === 'done' ? ' disabled' : ''} as-child><button type="button">${options.icons ? icon(name) : ''}${label}<demo-tabs-count>${count}</demo-tabs-count></button></demo-tabs-tab>`
    ).join('');
    const panels = options.panels
        ? FILTERS.map(
              ([value, label, count]) =>
                  `<demo-tabs-panel value="${value}"><p class="sb-section-text">${label}: ${count} карточек в наборе «Экзамен Законы UX».</p></demo-tabs-panel>`
          ).join('')
        : '';
    return `<demo-tabs ${attributes} default-value="all"><demo-tabs-list aria-label="Карточки">${tabs}<demo-tabs-indicator></demo-tabs-indicator></demo-tabs-list>${panels}</demo-tabs>`;
}

function sections(size: string): string {
    const tab = (value: string, name: IconName, label: string) =>
        `<demo-tabs-tab value="${value}" as-child><button type="button">${icon(name)}${label}</button></demo-tabs-tab>`;
    return `<demo-tabs variant="pill" size="${size}" orientation="vertical" default-value="home"><demo-tabs-list aria-label="Разделы">${tab('home', 'home', 'Главная')}${tab('community', 'globe', 'Сообщество')}${tab('collection', 'folder', 'Коллекция')}</demo-tabs-list></demo-tabs>`;
}

const markup = filters('data-story-target', { panels: true });

const meta: Meta<Props> = {
    title: 'Navigation/Tabs',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Вкладки (Figma "Tabs & Menu"): line — с подчёркиванием, которое переезжает к выбранной вкладке; pill — заливка выбранной; filter — чипы со счётчиком.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () =>
        page(
            section('Line', 'Figma "Horizontal Tab": разделы страницы с панелями под ними.', filters('', { panels: true })) +
                section(
                    'Pill',
                    'Figma "Vertical Tab": навигация в боковой панели, Large 56 и Medium 48.',
                    grid(sections('large') + sections('medium'), 240)
                ) +
                section(
                    'Filter',
                    'Figma "Filter Tab": фильтры списка со счётчиком; `stacked` — иконка над подписью.',
                    filters('variant="filter"', { icons: true }) + filters('variant="filter" stacked', { icons: true })
                )
        )
};
