import { contextMenu as recipe } from '@flippo-software/component-styles/context-menu';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function item(label: string, name: Parameters<typeof icon>[0], attributes = ''): string {
    return `<demo-context-menu-item ${attributes}>${icon(name)}${label}</demo-context-menu-item>`;
}

function setCard(attributes = ''): string {
    return `<demo-context-menu ${attributes}>
<demo-context-menu-trigger class="sb-card" style="cursor: context-menu">
<span class="sb-caption" style="display: flex; align-items: center; gap: 6px; color: var(--fl-color-set)">${icon('set')}32 карточки</span>
<strong>Экзамен Законы UX</strong>
<span class="sb-caption">Нажмите правой кнопкой мыши или долго удерживайте</span>
</demo-context-menu-trigger>
<demo-context-menu-positioner><demo-context-menu-popup>
${item('Открыть', 'preview')}${item('Переименовать', 'pencil')}${item('Скопировать ссылку', 'link')}
<demo-context-menu-separator></demo-context-menu-separator>
${item('Удалить набор', 'delete', 'tone="destructive"')}
</demo-context-menu-popup></demo-context-menu-positioner>
</demo-context-menu>`;
}

const markup = setCard('data-story-target');

const meta: Meta<Props> = {
    title: 'Overlays/ContextMenu',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(`<div class="sb-narrow">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Контекстное меню: открывается у курсора по правой кнопке мыши или долгому касанию.' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () =>
        page(section('Карточка набора', 'Меню действий набора на правой кнопке мыши.', `<div class="sb-narrow">${setCard()}</div>`))
};
