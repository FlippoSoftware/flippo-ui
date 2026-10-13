import { menubar as recipe } from '@flippo-software/component-styles/menubar';

import type { Meta, StoryObj } from '@storybook/web-components';

import { menuCheckbox, menuItem, menuPopup, page, renderExample, section, separator, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function menu(label: string, items: string): string {
    return `<demo-menu><demo-menubar-trigger as-child><button type="button">${label}</button></demo-menubar-trigger>${menuPopup(items)}</demo-menu>`;
}

function editorMenus(attributes = ''): string {
    return `<demo-menubar ${attributes} aria-label="Редактор набора">
${menu(
    'Набор',
    menuItem('Новая карточка', { icon: 'plus', end: '⌘N' }) +
        menuItem('Дублировать набор', { icon: 'copy' }) +
        separator +
        menuItem('Удалить набор', { icon: 'delete', attributes: 'tone="destructive"' })
)}
${menu('Вид', menuCheckbox('Показывать подсказки', 'default-checked') + menuCheckbox('Компактные карточки'))}
${menu('Справка', menuItem('Горячие клавиши') + menuItem('Что нового', { attributes: 'disabled' }))}
</demo-menubar>`;
}

const markup = editorMenus('data-story-target');

const meta: Meta<Props> = {
    title: 'Navigation/Menubar',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Строка меню: открыв одно меню, можно переходить по соседним наведением или стрелками.' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => page(section('Меню редактора', 'Пункты с иконками, сочетаниями клавиш, флажками и опасным действием.', editorMenus()))
};
