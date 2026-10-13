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
    triggerButton,
    variantControls
} from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const actions =
    menuItem('Редактировать', { icon: 'pencil', end: 'E' }) +
    menuItem('Дублировать', { icon: 'copy' }) +
    menuItem('Назначить себе', { icon: 'person-add' }) +
    menuItem('В список готовых', { icon: 'bookmark', attributes: 'disabled' }) +
    separator +
    menuItem('Удалить', { icon: 'delete', attributes: 'tone="destructive"' });

function cardMenu(attributes = ''): string {
    return `<demo-menu ${attributes}><demo-menu-trigger as-child>${triggerButton(icon('dots-vertical'), { variant: 'label', iconOnly: true }, 'aria-label="Действия с карточкой"')}</demo-menu-trigger>${menuPopup(actions)}</demo-menu>`;
}

const viewMenu = `<demo-menu><demo-menu-trigger as-child>${triggerButton(`Вид${icon('chevron-down')}`, { variant: 'secondary' })}</demo-menu-trigger>${menuPopup(
    `<demo-menu-group><demo-menu-group-label>Показывать</demo-menu-group-label>${menuCheckbox('Подсказки', 'default-checked')}${menuCheckbox('Пустые карточки')}</demo-menu-group>` +
        separator +
        `<demo-menu-group><demo-menu-group-label>Сортировка</demo-menu-group-label><demo-menu-radio-group default-value="recent">${menuRadio('recent', 'Недавние')}${menuRadio('alpha', 'По алфавиту')}</demo-menu-radio-group></demo-menu-group>` +
        separator +
        `<demo-menu-submenu><demo-menu-submenu-trigger>${icon('folder')}Переместить в папку<demo-menu-item-end>${icon('chevron-right')}</demo-menu-item-end></demo-menu-submenu-trigger>${menuPopup(menuItem('Саморазвитие') + menuItem('2 семестр'))}</demo-menu-submenu>`
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
                component:
                    'Меню действий (Figma "Menu Item"): обычные и опасные (`tone="destructive"`) пункты, флажки, переключатели, группы и вложенные меню. Подсветка следует за курсором и стрелками.'
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
            section('Действия', 'Иконки, сочетание клавиш, недоступный и опасный пункты.', row('card menu', cardMenu())) +
                section('Флажки, выбор и вложенное меню', 'Группы с заголовками, флажки, переключатели и подменю.', row('view', viewMenu))
        )
};
