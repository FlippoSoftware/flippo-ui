import { spinner as recipe } from '@flippo-software/component-styles/spinner';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

const markup = '<demo-spinner data-story-target role="status" aria-label="Загрузка"></demo-spinner>';

const meta: Meta<Props> = {
    title: 'Feedback/Spinner',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Индикатор ожидания. `color="current"` берёт цвет текста — так спиннер встраивается в кнопки.' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const spinner = (attributes: string, label: string) => `<demo-spinner ${attributes} role="status" aria-label="${label}"></demo-spinner>`;
const loading = '<demo-spinner size="x-small" color="current" aria-hidden="true"></demo-spinner>';

export const Gallery: Story = {
    render: () =>
        page(
            section(
                'Размеры',
                '',
                row('size', ['x-small', 'small', 'medium', 'large'].map((size) => spinner(`size="${size}"`, size)).join(''))
            ) +
                section(
                    'Цвета',
                    '',
                    row(
                        'color',
                        ['brand', 'success', 'info', 'warning', 'danger', 'current']
                            .map((color) => spinner(`color="${color}"`, color))
                            .join('')
                    )
                ) +
                section(
                    'В кнопке',
                    'Кнопка в состоянии загрузки: спиннер цвета текста вместо иконки.',
                    row(
                        'loading',
                        `<demo-button as-child><button type="button" disabled>${loading}Сохраняем</button></demo-button><demo-button variant="secondary" as-child><button type="button" disabled>${loading}Загрузка</button></demo-button>`
                    )
                )
        )
};
