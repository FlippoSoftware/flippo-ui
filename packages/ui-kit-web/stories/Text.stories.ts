import { text as recipe } from '@flippo-software/component-styles/text';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

const markup = '<demo-text data-story-target as-child><p>Закон Хика: время решения растёт с числом вариантов.</p></demo-text>';

const SIZES = [
    'display-1',
    'display-2',
    'title-1',
    'title-2',
    'title-3',
    'heading-1',
    'heading-2',
    'heading-3',
    'body-plus',
    'body',
    'body-minus',
    'label'
];
const COLORS = ['primary', 'secondary', 'tertiary', 'quaternary', 'disabled', 'brand', 'success', 'warning', 'error'];

const text = (attributes: string, content: string) => `<demo-text ${attributes}>${content}</demo-text>`;

const meta: Meta<Props> = {
    title: 'Typography/Text',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Текст по типографической шкале Figma: `size` × `weight` дают класс `fl-text-<size>-<weight>`; цвет, выравнивание, регистр и обрезка — отдельными атрибутами. Нужный тег (`<p>`, `<h2>`) — через `as-child`.'
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
                'Шкала',
                'Все размеры в весе default.',
                SIZES.map((size) => row(size, text(`size="${size}" truncate`, 'Экзамен Законы UX'))).join('')
            ) +
                section(
                    'Насыщенность',
                    '',
                    ['weaker', 'default', 'stronger']
                        .map((weight) => row(weight, text(`size="body-plus" weight="${weight}"`, 'Повторяйте сложные карточки чаще')))
                        .join('')
                ) +
                section('Цвета', '', row('color', COLORS.map((color) => text(`color="${color}"`, color)).join(''))) +
                section(
                    'Обрезка',
                    '`truncate` — одна строка с многоточием.',
                    `<div class="sb-narrow">${text('truncate style="display: block"', 'JavaScript: замыкания, контекст выполнения, прототипы и цепочка областей видимости')}</div>`
                )
        )
};
