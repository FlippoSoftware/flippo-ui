import type { Meta, StoryObj } from '@storybook/web-components';

import type { DefaultProps, DefaultPropsElement, SelectElement } from '../src';

import { search } from './choice';
import { button, icon, page, row, section } from './kit';

type Size = 'small' | 'medium' | 'large';
type Props = { size: Size; appearance: 'light' | 'inverted'; buttonVariant: 'primary' | 'secondary' | 'outlined' };

const FILTERS = { all: 'Все карточки', mine: 'Мои', done: 'Готовые' };

/** Elements without size or look attributes: they take them from the provider. */
const screen = `<div class="sb-items sb-items--column" style="align-items: stretch; max-inline-size: 420px">
${search()}
<demo-select default-value="all">
<demo-select-trigger as-child><button type="button" aria-label="Фильтр"><demo-select-value></demo-select-value><demo-select-icon></demo-select-icon></button></demo-select-trigger>
<demo-select-positioner><demo-select-popup><demo-select-list>${Object.entries(FILTERS)
    .map(
        ([value, label]) =>
            `<demo-select-item value="${value}"><demo-select-item-text>${label}</demo-select-item-text><demo-select-item-indicator></demo-select-item-indicator></demo-select-item>`
    )
    .join('')}</demo-select-list></demo-select-popup></demo-select-positioner>
</demo-select>
<demo-segmented-control default-value="week" aria-label="Период">${['day:День', 'week:Неделя', 'month:Месяц']
    .map((entry) => {
        const [value, label] = entry.split(':');
        return `<demo-segmented-control-item value="${value}" as-child><button type="button">${label}</button></demo-segmented-control-item>`;
    })
    .join('')}</demo-segmented-control>
<div class="sb-items">${button(`${icon('plus')}Создать набор`)}${button('Отмена', 'variant="label"')}</div>
</div>`;

/** A provider around the screen, with its `defaults` property; `items` gives the select its labels. */
function provided(defaults: DefaultProps, content = screen): HTMLElement {
    const provider = document.createElement('demo-default-props') as DefaultPropsElement;
    provider.defaults = defaults;
    provider.innerHTML = content;
    for (const select of provider.querySelectorAll<SelectElement>('demo-select')) select.items = FILTERS;
    return provider;
}

function defaultsOf({ size, appearance, buttonVariant }: Props): DefaultProps {
    return {
        button: { size, variant: buttonVariant },
        input: { size, appearance },
        select: { size, appearance, positioner: { sideOffset: 4 } },
        segmentedControl: { size }
    };
}

const code = `define({ prefix: 'ui', defaults: { button: { size: 'small' } } });

<ui-default-props>…</ui-default-props>
provider.defaults = { select: { size: 'small', positioner: { sideOffset: 4 } } };`;

const meta: Meta<Props> = {
    title: 'Utilities/DefaultProps',
    args: { size: 'small', appearance: 'light', buttonVariant: 'primary' },
    argTypes: {
        size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
        appearance: { control: 'inline-radio', options: ['light', 'inverted'] },
        buttonVariant: { control: 'inline-radio', options: ['primary', 'secondary', 'outlined'] }
    },
    render: (args: Props) => {
        const root = document.createElement('div');
        root.className = 'story-example';
        root.append(provided(defaultsOf(args)));
        return root;
    },
    parameters: {
        docs: {
            source: { code, language: 'ts' },
            description: {
                component:
                    'Атрибуты по умолчанию для семейств кита: глобально через `define({ defaults })` и для области через `<demo-default-props>` (свойство `defaults`; изменения применяются сразу). Ключ семейства — имя в camelCase (`segmentedControl`), ключ части — имя элемента (`positioner`). Порядок: атрибут или свойство элемента → запись части → то, что передаёт корень → запись семейства → встроенные умолчания. Вложенные провайдеры сливаются с внешними.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => {
        const root = page(
            section(
                'Один экран, разные настройки',
                'Элементы не задают ни размер, ни вид — их даёт провайдер.',
                row('small', '<div data-slot="small"></div>') + row('large', '<div data-slot="large"></div>')
            ) +
                section(
                    'Вложенный провайдер',
                    'Внешний задаёт размер, внутренний — вид кнопок только для своей области; атрибут на элементе всё равно главнее.',
                    '<div data-slot="nested"></div>'
                )
        );
        for (const size of ['small', 'large'] as const) {
            root.querySelector(`[data-slot="${size}"]`)?.replaceWith(
                provided({ button: { size }, input: { size }, select: { size }, segmentedControl: { size } })
            );
        }
        const inner = provided({ button: { variant: 'outlined' } }, row('inner', button('Сохранить') + button('Отмена')));
        const outer = provided(
            { button: { size: 'small' } },
            row('outer', button('Сохранить') + button('size="large" на кнопке', 'size="large"'))
        );
        outer.append(inner);
        root.querySelector('[data-slot="nested"]')?.replaceWith(outer);
        return root;
    }
};
