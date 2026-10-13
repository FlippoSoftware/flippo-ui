import { segmentedControl as recipe } from '@flippo-software/component-styles/segmented-control';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function segment(value: string, content: string, attributes = ''): string {
    return `<demo-segmented-control-item value="${value}" ${attributes} as-child><button type="button">${content}</button></demo-segmented-control-item>`;
}

function period(attributes = ''): string {
    return `<demo-segmented-control ${attributes} default-value="week" aria-label="Период статистики">${segment('day', 'День')}${segment('week', 'Неделя')}${segment('month', 'Месяц')}${segment('year', 'Год', 'disabled')}</demo-segmented-control>`;
}

const markup = period('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/SegmentedControl',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Переключатель вида: один вариант из нескольких на общей подложке.' }
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
                'Размеры',
                'Высота сегмента 28, 32 и 40px.',
                (['small', 'medium', 'large'] as const).map((size) => row(size, period(`size="${size}"`))).join('')
            ) +
                section(
                    'С иконками и недоступный',
                    'Иконка перед подписью; вся группа может быть недоступна.',
                    row(
                        'icons',
                        `<demo-segmented-control default-value="cards" aria-label="Вид">${segment('list', `${icon('format-list-ul')}Список`)}${segment('cards', `${icon('set')}Карточки`)}</demo-segmented-control>`
                    ) + row('disabled', period('disabled'))
                )
        )
};
