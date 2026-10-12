import { combobox as recipe } from '@flippo-software/component-styles/combobox';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const LAWS = ['Закон Якоба', 'Закон Фиттса', 'Закон Хика', 'Закон близости', 'Закон Миллера', 'Эффект эстетики', 'Закон Теслера'];

const popup = `<demo-combobox-positioner><demo-combobox-popup>
<demo-combobox-empty>Ничего не найдено</demo-combobox-empty>
<demo-combobox-list>${LAWS.map((law) => `<demo-combobox-item value="${law}">${law}<demo-combobox-item-indicator></demo-combobox-item-indicator></demo-combobox-item>`).join('')}</demo-combobox-list>
</demo-combobox-popup></demo-combobox-positioner>`;

function laws(attributes = '', inputAttributes = ''): string {
    return `<demo-combobox ${attributes}>
<demo-combobox-input-group>
<demo-combobox-input as-child><input aria-label="Закон" placeholder="Найти закон…" ${inputAttributes}/></demo-combobox-input>
<demo-combobox-clear aria-label="Очистить"></demo-combobox-clear>
<demo-combobox-trigger aria-label="Показать законы"></demo-combobox-trigger>
</demo-combobox-input-group>
${popup}
</demo-combobox>`;
}

const chips = `<demo-combobox multiple chips data-default-values>
<demo-combobox-input-group>
<demo-combobox-chips>
<template><demo-combobox-chip><demo-combobox-chip-label></demo-combobox-chip-label><demo-combobox-chip-remove aria-label="Убрать"></demo-combobox-chip-remove></demo-combobox-chip></template>
<demo-combobox-input as-child><input aria-label="Законы" placeholder="Добавить закон…"/></demo-combobox-input>
</demo-combobox-chips>
<demo-combobox-clear aria-label="Очистить"></demo-combobox-clear>
<demo-combobox-trigger aria-label="Показать законы"></demo-combobox-trigger>
</demo-combobox-input-group>
${popup}
</demo-combobox>`;

/** `items` (the values the input text and the chips come from) and the values of a `multiple` combobox are array properties. */
function setValues(root: HTMLElement): void {
    for (const combobox of root.querySelectorAll<HTMLElement & { items?: string[]; defaultValue?: unknown }>('demo-combobox')) {
        combobox.items = LAWS;
        if (combobox.hasAttribute('data-default-values')) combobox.defaultValue = ['Закон Якоба', 'Закон Хика'];
    }
}

const markup = laws('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Combobox',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args, setValues),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Поле с выбором из списка: ввод фильтрует варианты, список по ширине поля. С `multiple` выбранные значения становятся чипами: `demo-combobox-chips` копирует чип из своего `<template>` для каждого значения.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const medium = (html: string) => `<div class="sb-medium">${html}</div>`;

export const Gallery: Story = {
    render: () =>
        page(
            section(
                'Размеры',
                'Large, Medium и Small, как у Input.',
                (['large', 'medium', 'small'] as const).map((size) => row(size, medium(laws(`size="${size}"`)))).join('')
            ) +
                section('Несколько значений', 'Выбранные значения — чипы; Backspace удаляет последний.', medium(chips)) +
                section(
                    'На карточке',
                    'Inverted и недоступное поле.',
                    row('inverted', medium(laws('appearance="inverted" default-value="Закон Фиттса"'))) +
                        row('disabled', medium(laws('appearance="inverted" disabled default-value="Закон Фиттса"', 'disabled'))),
                    { raised: true }
                ),
            setValues
        )
};
