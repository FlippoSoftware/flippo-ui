import { menu as recipe } from '@flippo-software/component-styles/menu';

import type { Meta, StoryObj } from '@storybook/web-components';

import {
    icon,
    menuCheckbox,
    menuItem,
    menuPopup,
    menuRadio,
    page,
    renderExample,
    row,
    section,
    separator,
    t,
    triggerButton,
    variantControls
} from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const actions = () =>
    menuItem(t('menu.content.edit'), { icon: 'pencil', end: 'E' }) +
    menuItem(t('menu.content.duplicate'), { icon: 'copy' }) +
    menuItem(t('menu.content.assignToMe'), { icon: 'person-add' }) +
    menuItem(t('menu.content.moveToDone'), { icon: 'bookmark', attributes: 'disabled' }) +
    separator +
    menuItem(t('common.delete'), { icon: 'delete', attributes: 'tone="destructive"' });

function cardMenu(attributes = ''): string {
    return `<demo-menu ${attributes}><demo-menu-trigger as-child>${triggerButton(icon('dots-vertical'), { variant: 'label', iconOnly: true }, `aria-label="${t('menu.labels.cardActions')}"`)}</demo-menu-trigger>${menuPopup(actions())}</demo-menu>`;
}

const viewMenu = () =>
    `<demo-menu><demo-menu-trigger as-child>${triggerButton(`${t('common.view')}${icon('chevron-down')}`, { variant: 'secondary' })}</demo-menu-trigger>${menuPopup(
        `<demo-menu-group><demo-menu-group-label>${t('menu.content.show')}</demo-menu-group-label>${menuCheckbox(t('common.hints'), 'default-checked')}${menuCheckbox(t('menu.content.emptyCards'))}</demo-menu-group>` +
            separator +
            `<demo-menu-group><demo-menu-group-label>${t('menu.content.sort')}</demo-menu-group-label><demo-menu-radio-group default-value="recent">${menuRadio('recent', t('menu.content.recent'))}${menuRadio('alpha', t('menu.content.alphabetical'))}</demo-menu-radio-group></demo-menu-group>` +
            separator +
            `<demo-menu-submenu><demo-menu-submenu-trigger>${icon('folder')}${t('menu.content.moveToAFolder')}<demo-menu-item-end>${icon('chevron-right')}</demo-menu-item-end></demo-menu-submenu-trigger>${menuPopup(menuItem(t('common.selfImprovement')) + menuItem(t('common.term2')))}</demo-menu-submenu>`
    )}</demo-menu>`;

const markup = cardMenu('data-story-target');

const meta: Meta<Props> = {
    title: 'Overlays/Menu',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'menu.descriptionWeb'
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
            section(t('menu.sections.actions.title'), t('menu.sections.actions.description'), row('card menu', cardMenu())) +
                section(
                    t('menu.sections.checkboxesChoiceAndA.title'),
                    t('menu.sections.checkboxesChoiceAndA.descriptionWeb'),
                    row('view', viewMenu())
                )
        )
};
