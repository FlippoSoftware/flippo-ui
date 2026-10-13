import { checkbox as recipe } from '@flippo-software/component-styles/checkbox';

import type { Meta, StoryObj } from '@storybook/web-components';

import { checkbox, page, renderExample, row, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; defaultChecked?: boolean; indeterminate?: boolean };

const markup = checkbox('Перемешивать карточки', 'data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Checkbox',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        defaultChecked: { control: 'boolean', table: { category: 'Behaviour' } },
        indeterminate: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Чекбокс: рамка 20px, при выборе заливается цветом бренда. Индикатор сам рисует галочку или минус (`indeterminate`). `<demo-checkbox-label as-child><label>` — подпись вокруг чекбокса: нажатие на текст переключает его.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

function states(attributes: string, labelAttributes = ''): string {
    return (
        checkbox('Не выбран', attributes, labelAttributes) +
        checkbox('Выбран', `${attributes} default-checked`, labelAttributes) +
        checkbox('Частично', `${attributes} indeterminate`, labelAttributes)
    );
}

export const Gallery: Story = {
    render: () =>
        page(
            section(
                'Состояния',
                'Выключен, включён, частично выбран и недоступен.',
                row('enabled', states('')) + row('disabled', states('disabled'))
            ) +
                section(
                    'Размеры',
                    '16, 20 и 24px; галочка масштабируется вместе с рамкой.',
                    (['small', 'medium', 'large'] as const).map((size) => row(size, states(`size="${size}"`, `size="${size}"`))).join('')
                )
        )
};
