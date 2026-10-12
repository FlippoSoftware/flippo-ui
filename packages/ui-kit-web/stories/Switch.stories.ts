import { switchRecipe as recipe } from '@flippo-software/component-styles/switch';

import type { Meta, StoryObj } from '@storybook/web-components';

import { toggleSwitch } from './choice';
import { renderExample, variantControls } from './helpers';
import { card, page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; defaultChecked?: boolean };

const markup = toggleSwitch('Перемешивать карточки', 'data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Switch',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        defaultChecked: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Переключатель настроек: применяет изменение сразу, без кнопки «Сохранить».' }
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
                'Состояния и размеры',
                '32×20, 40×24 и 48×28.',
                (['small', 'medium', 'large'] as const)
                    .map((size) =>
                        row(
                            size,
                            toggleSwitch('Выключен', `size="${size}"`, `size="${size}"`) +
                                toggleSwitch('Включён', `size="${size}" default-checked`, `size="${size}"`) +
                                toggleSwitch('Недоступен', `size="${size}" disabled default-checked`, `size="${size}"`)
                        )
                    )
                    .join('')
            ) +
                section(
                    'Настройки набора',
                    'Список переключателей на карточке.',
                    card(
                        `<div class="sb-items sb-items--column">${toggleSwitch('Перемешивать карточки', 'default-checked')}${toggleSwitch('Показывать подсказки')}${toggleSwitch('Повторять сложные чаще', 'default-checked')}</div>`
                    )
                )
        )
};
