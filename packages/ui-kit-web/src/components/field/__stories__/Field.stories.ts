import { field as recipe } from '@flippo-software/component-styles/field';

import type { Meta, StoryObj } from '@storybook/web-components';

import { grid, page, renderExample, section, textInput, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; invalid?: boolean };

function titleField(
    fieldAttributes = '',
    inputAttributes = '',
    options: { value?: string; description?: string; input?: string } = {}
): string {
    const { value, description = 'Видно всем участникам набора', input = '' } = options;
    return `<demo-field name="title" ${fieldAttributes}>
<demo-field-label>Название набора</demo-field-label>
${textInput(input, 'placeholder="Например, Законы UX"', { control: `${value ? `default-value="${value}"` : ''} ${inputAttributes}` })}
<demo-field-description>${description}</demo-field-description>
<demo-field-error${fieldAttributes.includes('invalid') ? ' match="true"' : ''}>Название не может быть пустым</demo-field-error>
</demo-field>`;
}

const markup = titleField('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Field',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        invalid: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Поле формы: подпись, контрол, описание и ошибка. Состояния (`data-invalid`, `data-disabled`, `data-focused`) приходят от Field и окрашивают все части; ошибка видна, пока поле невалидно.'
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
                'Обычное, с ошибкой и недоступное.',
                grid(
                    titleField('', '', { value: 'Экзамен Законы UX' }) +
                        titleField('invalid') +
                        titleField('disabled', 'disabled', { value: 'Экзамен Законы UX', description: 'Изменить может только владелец' }),
                    300
                )
            ) +
                section(
                    'Размеры',
                    'Контрол поля — Input любого размера и оформления.',
                    grid(
                        titleField('', '', { value: 'Large', input: 'size="large"' }) +
                            titleField('', '', { value: 'Medium', input: 'size="medium"' }) +
                            titleField('', '', { value: 'Small', input: 'size="small"' }),
                        300
                    )
                ) +
                section(
                    'На карточке',
                    'Inverted — для полей на поверхности bg-1.',
                    grid(
                        titleField('', '', { input: 'appearance="inverted"' }) +
                            titleField('invalid', '', { input: 'appearance="inverted"' }),
                        300
                    ),
                    { raised: true }
                )
        )
};
