import { toolbar as recipe } from '@flippo-software/component-styles/toolbar';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { icon, page, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

function toolButton(content: string): string {
    return `<demo-toolbar-button as-child><button type="button">${content}</button></demo-toolbar-button>`;
}

function toggle(value: string, name: 'format-bold' | 'format-italic' | 'format-underline', label: string): string {
    return `<demo-toggle value="${value}" as-child><button type="button" aria-label="${label}">${icon(name)}</button></demo-toggle>`;
}

const separator = '<demo-toolbar-separator></demo-toolbar-separator>';

function editor(attributes = ''): string {
    return `<demo-toolbar ${attributes} aria-label="Форматирование карточки">
<demo-toggle-group multiple aria-label="Начертание">${toggle('bold', 'format-bold', 'Жирный')}${toggle('italic', 'format-italic', 'Курсив')}${toggle('underline', 'format-underline', 'Подчёркнутый')}</demo-toggle-group>
${separator}
<demo-toolbar-group aria-label="Блоки">${toolButton(`${icon('hint')}Подсказка`)}${toolButton(`${icon('format-list-ul')}Список`)}</demo-toolbar-group>
${separator}
<demo-toolbar-link as-child><a href="#help">Справка</a></demo-toolbar-link>
</demo-toolbar>`;
}

const markup = editor('data-story-target');

const meta: Meta<Props> = {
    title: 'Navigation/Toolbar',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Панель инструментов: один шаг Tab, дальше стрелки; кнопки, переключатели, ссылки и поле в одной строке. `demo-toggle-group` внутри панели встраивается в её навигацию.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const withSearch = `<demo-toolbar aria-label="Набор">${toolButton(`${icon('plus')}Карточка`)}${toolButton(`${icon('shuffle')}Перемешать`)}${separator}<demo-toolbar-input as-child><input aria-label="Поиск по карточкам" placeholder="Поиск по карточкам"/></demo-toolbar-input></demo-toolbar>`;

export const Gallery: Story = {
    render: () =>
        page(
            section('Редактор карточки', 'Переключатели начертания, кнопки блоков и ссылка, разделённые линиями.', editor()) +
                section('С поиском', 'Поле в панели инструментов — небольшое inverted.', withSearch)
        )
};
