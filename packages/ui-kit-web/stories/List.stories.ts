import { list as recipe } from '@flippo-software/component-styles/list';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { icon, page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

const STEPS = ['Создайте набор', 'Добавьте карточки', 'Пригласите участников', 'Начните повторение'];

const item = (marker: string, content: string) =>
    `<demo-list-item as-child><li><demo-list-marker>${marker}</demo-list-marker>${content}</li></demo-list-item>`;

/** `attributes` go on the native list, the `as-child` target that gets the classes (`data-nested`, `data-orientation`). */
function list(tag: 'ol' | 'ul', items: string, attributes = '', host = ''): string {
    return `<demo-list ${host} as-child><${tag} ${attributes}>${items}</${tag}></demo-list>`;
}

const ordered = (entries: readonly string[], attributes = '', host = '') =>
    list('ol', entries.map((entry, index) => item(`${index + 1}.`, entry)).join(''), attributes, host);
const bulleted = (entries: readonly string[], attributes = '') => list('ul', entries.map((entry) => item('•', entry)).join(''), attributes);

const nested = list(
    'ol',
    `<demo-list-item as-child><li><demo-list-marker>1.</demo-list-marker><demo-list-subheader id="laws-ux">Законы UX</demo-list-subheader>${ordered(['Закон Хика', 'Закон Фиттса', 'Закон Миллера'], 'data-nested aria-labelledby="laws-ux"')}</li></demo-list-item>` +
        `<demo-list-item as-child><li><demo-list-marker>2.</demo-list-marker><demo-list-subheader id="laws-gestalt">Гештальт</demo-list-subheader>${bulleted(['Близость', 'Сходство', 'Замкнутость'], 'data-nested aria-labelledby="laws-gestalt"')}</li></demo-list-item>`
);

const FOLDERS = [
    ['ux', 'Законы UX', '32'],
    ['js', 'JavaScript', '18'],
    ['en', 'Английский B2', '120'],
    ['archive', 'Архив', '0']
] as const;

const folders = list(
    'ul',
    FOLDERS.map(
        ([id, name, count]) =>
            `<demo-list-item as-child><li data-interactive role="button" tabindex="${id === 'archive' ? '-1' : '0'}"${id === 'ux' ? ' data-selected aria-selected="true"' : ''}${id === 'archive' ? ' data-disabled aria-disabled="true"' : ''}>${icon('folder')}<span style="flex: 1">${name}</span><span class="sb-caption">${count}</span></li></demo-list-item>`
    ).join(''),
    'style="inline-size: 100%"'
);

/** Selects the pressed folder: the presentation list has no selection state of its own. */
function selectFolders(root: HTMLElement): void {
    root.addEventListener('click', (event) => {
        const pressed = (event.target as Element).closest('li[data-interactive]:not([data-disabled])');
        if (!pressed) return;
        for (const folder of pressed.parentElement?.children ?? []) {
            folder.toggleAttribute('data-selected', folder === pressed);
            folder.setAttribute('aria-selected', String(folder === pressed));
        }
    });
}

const markup = ordered(STEPS, '', 'data-story-target');

const meta: Meta<Props> = {
    title: 'Display/List',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Список над нативными `<ol>`/`<ul>`. В отличие от React, части только задают стили: маркеры пишутся в разметке, а состояния — атрибутами `data-nested`, `data-orientation`, `data-interactive`, `data-selected`, `data-disabled`.'
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
            section('Нумерованный и маркированный', '', row('ordered', ordered(STEPS)) + row('unordered', bulleted(STEPS))) +
                section(
                    'Вложенные списки с подзаголовками',
                    'Вложенный список — внутри пункта, подзаголовок подписывает его (`aria-labelledby`).',
                    nested
                ) +
                section(
                    'Интерактивные пункты',
                    'Строки-кнопки: наведение, выбранный и недоступный пункт.',
                    `<div class="sb-narrow">${folders}</div>`
                ) +
                section(
                    'Горизонтальный',
                    '`data-orientation="horizontal"` — пункты в строку с переносом.',
                    bulleted(['Дизайн', 'UX', 'Психология', 'Экзамен'], 'data-orientation="horizontal"')
                ),
            selectFolders
        )
};
