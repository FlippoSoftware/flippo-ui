import { numberField as recipe } from '@flippo-software/component-styles/number-field';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function count(attributes = '', value = 10): string {
    return `<demo-number-field ${attributes} default-value="${value}" min="1" max="50">
<demo-number-field-group>
<demo-number-field-decrement aria-label="Меньше"></demo-number-field-decrement>
<demo-number-field-input as-child><input aria-label="Карточек за раз"/></demo-number-field-input>
<demo-number-field-increment aria-label="Больше"></demo-number-field-increment>
</demo-number-field-group>
</demo-number-field>`;
}

const markup = count('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/NumberField',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'Числовое поле с кнопками − и +; стрелки клавиатуры и колесо меняют значение, границы — `min` и `max`.'
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
                'Размеры',
                'Large, Medium и Small, как у Input.',
                (['large', 'medium', 'small'] as const).map((size) => row(size, count(`size="${size}"`))).join('')
            ) +
                section(
                    'Оформление и состояния',
                    'Inverted — на карточке; на границе диапазона кнопка выключается.',
                    row('inverted', count('appearance="inverted"')) +
                        row('at min', count('appearance="inverted"', 1)) +
                        row('disabled', count('appearance="inverted" disabled')),
                    { raised: true }
                )
        )
};
