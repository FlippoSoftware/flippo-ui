import { pinInput as recipe } from '@flippo-software/component-styles/pin-input';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function code(attributes = '', options: { length?: number; invalid?: boolean } = {}): string {
    const { length = 4, invalid = false } = options;
    const pins = Array.from(
        { length },
        (_, index) =>
            `<demo-pin-input-pin as-child><input aria-label="Цифра ${index + 1}"${invalid ? ' aria-invalid="true"' : ''}/></demo-pin-input-pin>`
    ).join('');
    return `<div class="sb-items sb-items--column" style="align-items: flex-start"><demo-pin-input ${attributes}><demo-pin-input-group><demo-pin-input-focus-funnel>${pins}</demo-pin-input-focus-funnel></demo-pin-input-group></demo-pin-input><output aria-live="polite" class="sb-caption">Введите код из письма</output></div>`;
}

/** Reports the complete code under each pin input. */
function reportComplete(root: HTMLElement): void {
    root.addEventListener('value-complete', (event) => {
        const output = (event.target as HTMLElement).parentElement?.querySelector('output');
        if (output) output.textContent = 'Код введён';
    });
}

const markup = code('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/PinInput',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args, reportComplete),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Ввод кода (Figma "Numeric"): ячейки 64×80 по одной цифре; вставка из буфера заполняет все ячейки. Когда код введён, элемент шлёт `value-complete`.'
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
                'Состояния',
                'Пустой, заполненный, с ошибкой и недоступный.',
                row('blank', code()) +
                    row('filled', code('default-value="4271"')) +
                    row('wrong', code('default-value="4271"', { invalid: true })) +
                    row('disabled', code('default-value="42" disabled'))
            ) +
                section(
                    'Размеры',
                    'Large 64×80 (Figma) и Medium 48×56 для форм потеснее.',
                    row('large', code('size="large"', { length: 6 })) + row('medium', code('size="medium"', { length: 6 }))
                ) +
                section(
                    'На карточке',
                    'Inverted и скрытые символы (`mask`).',
                    row('inverted', code('appearance="inverted" default-value="4271" mask')),
                    {
                        raised: true
                    }
                ),
            reportComplete
        )
};
