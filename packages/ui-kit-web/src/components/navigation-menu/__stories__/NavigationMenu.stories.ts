import { navigationMenu as recipe } from '@flippo-software/component-styles/navigation-menu';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function link(href: string, title: string, description: string): string {
    return `<demo-navigation-menu-link as-child><a href="${href}">${title}<demo-navigation-menu-link-description>${description}</demo-navigation-menu-link-description></a></demo-navigation-menu-link>`;
}

function item(value: string, label: string, content: string): string {
    return `<demo-navigation-menu-item value="${value}"><demo-navigation-menu-trigger as-child><button type="button">${label}<demo-navigation-menu-icon></demo-navigation-menu-icon></button></demo-navigation-menu-trigger><demo-navigation-menu-content>${content}</demo-navigation-menu-content></demo-navigation-menu-item>`;
}

function site(attributes = ''): string {
    const learn = `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 220px)); gap: 4px">${
        link('#sets', t('navigationMenu.content.sets'), t('navigationMenu.content.cardsOnTopicsFrom')) +
        link('#repeat', t('navigationMenu.content.review'), t('navigationMenu.content.spacedRepetitionForToday')) +
        link('#exam', t('navigationMenu.content.testYourself'), t('navigationMenu.content.aTestOnEvery')) +
        link('#stats', t('navigationMenu.content.statistics'), t('navigationMenu.content.progressOverTheWeek'))
    }</div>`;
    const create =
        link('#new', t('common.newSet'), t('navigationMenu.content.fromScratchOrFrom')) +
        link('#import', t('navigationMenu.content.import'), t('navigationMenu.content.fromCsvAnkiOr'));
    return `<demo-navigation-menu ${attributes}>
<demo-navigation-menu-list>
${item('learn', t('navigationMenu.content.learn'), learn)}
${item('create', t('navigationMenu.content.create'), create)}
<demo-navigation-menu-item><demo-navigation-menu-link as-child><a href="#community" class="fl-navigation-menu-trigger fl-interactive fl-focus-ring fl-text-body-minus-stronger">${t('common.community')}</a></demo-navigation-menu-link></demo-navigation-menu-item>
</demo-navigation-menu-list>
<demo-navigation-menu-positioner><demo-navigation-menu-popup><demo-navigation-menu-viewport></demo-navigation-menu-viewport></demo-navigation-menu-popup></demo-navigation-menu-positioner>
</demo-navigation-menu>`;
}

const markup = site('data-story-target');

const meta: Meta<Props> = {
    title: 'Navigation/NavigationMenu',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'navigationMenu.description'
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
            section(
                t('navigationMenu.sections.mainNavigation.title'),
                t('navigationMenu.sections.mainNavigation.description'),
                `<div style="min-height: 260px">${site()}</div>`
            )
        )
};
