import { toggleGroup as recipe } from '@flippo-software/component-styles/toggle-group';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function item(value: string, content: string, attributes = '', label = ''): string {
    return `<demo-toggle value="${value}" ${attributes} as-child><button type="button"${label ? ` aria-label="${label}"` : ''}>${content}</button></demo-toggle>`;
}

function formatting(attributes = ''): string {
    return `<demo-toggle-group ${attributes} multiple default-value="bold" aria-label="Форматирование текста">
${item('bold', icon('format-bold'), '', 'Жирный')}
${item('italic', icon('format-italic'), '', 'Курсив')}
${item('underline', icon('format-underline'), '', 'Подчёркнутый')}
${item('list', icon('format-list-ul'), '', 'Список')}
</demo-toggle-group>`;
}

const markup = formatting('data-story-target');

const meta: Meta<Props> = {
    title: 'Actions/ToggleGroup',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Группа переключателей: несколько независимых (`multiple`) или один из нескольких; `contained` добавляет подложку. `default-value` — значения через пробел.'
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
                'Оформление',
                'Без подложки — в панелях инструментов; с подложкой — отдельно стоящая группа.',
                row('plain', formatting()) + row('contained', formatting('contained')) + row('disabled', formatting('contained disabled'))
            ) +
                section(
                    'Один из нескольких',
                    'Без `multiple` нажатие выбирает один вариант, как переключатель вида.',
                    row(
                        'single',
                        `<demo-toggle-group contained default-value="list" aria-label="Вид коллекции">${item('list', `${icon('format-list-ul')}Список`, 'variant="labeled"')}${item('cards', `${icon('set')}Карточки`, 'variant="labeled"')}</demo-toggle-group>`
                    )
                )
        )
};
