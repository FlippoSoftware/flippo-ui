import { tabs as recipe } from '@flippo-software/component-styles/tabs';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/web-components';

import { grid, icon, page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const FILTERS = (): [string, string, number, IconName][] => [
    ['all', t('tabs.content.all'), 7, 'set'],
    ['mine', t('common.mine'), 1, 'person-add'],
    ['free', t('common.free'), 4, 'star'],
    ['done', t('common.completed'), 0, 'check']
];

function filters(attributes = '', options: { icons?: boolean; panels?: boolean } = {}): string {
    const tabs = FILTERS()
        .map(
            ([value, label, count, name]) =>
                `<demo-tabs-tab value="${value}"${value === 'done' ? ' disabled' : ''} as-child><button type="button">${options.icons ? icon(name) : ''}${label}<demo-tabs-count>${count}</demo-tabs-count></button></demo-tabs-tab>`
        )
        .join('');
    const panels = options.panels
        ? FILTERS()
              .map(
                  ([value, label, count]) =>
                      `<demo-tabs-panel value="${value}"><p class="sb-section-text">${label}: ${count} ${t('tabs.content.cardsInTheSet')}</p></demo-tabs-panel>`
              )
              .join('')
        : '';
    return `<demo-tabs ${attributes} default-value="all"><demo-tabs-list aria-label="${t('common.cards')}">${tabs}<demo-tabs-indicator></demo-tabs-indicator></demo-tabs-list>${panels}</demo-tabs>`;
}

function sections(size: string): string {
    const tab = (value: string, name: IconName, label: string) =>
        `<demo-tabs-tab value="${value}" as-child><button type="button">${icon(name)}${label}</button></demo-tabs-tab>`;
    return `<demo-tabs variant="pill" size="${size}" orientation="vertical" default-value="home"><demo-tabs-list aria-label="${t('tabs.labels.sections')}">${tab('home', 'home', t('tabs.content.home'))}${tab('community', 'globe', t('common.community'))}${tab('collection', 'folder', t('common.collection'))}</demo-tabs-list></demo-tabs>`;
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
                component: 'tabs.description'
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
            section('Line', t('tabs.sections.line.description'), filters('', { panels: true })) +
                section('Pill', t('tabs.sections.pill.description'), grid(sections('large') + sections('medium'), 240)) +
                section(
                    'Filter',
                    t('tabs.sections.filter.descriptionWeb'),
                    filters('variant="filter"', { icons: true }) + filters('variant="filter" stacked', { icons: true })
                )
        )
};
