import { accordion as recipe } from '@flippo-software/component-styles/accordion';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, page, renderExample, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { multiple?: boolean };

const LAWS = [
    ['aesthetic', 'Эффект эстетики', 'Пользователи воспринимают эстетичный дизайн как более удобный.'],
    ['proximity', 'Закон близости', 'Элементы, расположенные близко друг к другу, воспринимаются как группа.'],
    ['jakob', 'Закон Якоба', 'Пользователи проводят больше времени на других сайтах и ждут, что ваш работает так же.'],
    ['hick', 'Закон Хика', 'Время принятия решения растёт с числом и сложностью вариантов.']
] as const;

function laws(attributes = '', open = 'aesthetic'): string {
    return `<demo-accordion ${attributes} default-value="${open}">${LAWS.map(
        ([value, title, text]) =>
            `<demo-accordion-item value="${value}"><demo-accordion-header><demo-accordion-trigger as-child><button type="button">${title}<demo-accordion-icon></demo-accordion-icon></button></demo-accordion-trigger></demo-accordion-header><demo-accordion-panel><demo-accordion-content>${text}</demo-accordion-content></demo-accordion-panel></demo-accordion-item>`
    ).join('')}</demo-accordion>`;
}

const markup = laws('data-story-target');

const meta: Meta<Props> = {
    title: 'Disclosure/Accordion',
    args: {},
    argTypes: { ...variantControls(recipe), multiple: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Аккордеон: панели раскрываются плавно по высоте содержимого; `multiple` позволяет открыть несколько сразу (`default-value` — значения через пробел).'
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
            section('Одна открытая панель', 'Открытие новой панели закрывает предыдущую.', `<div class="sb-medium">${laws()}</div>`) +
                section(
                    'Несколько панелей',
                    'С `multiple`; на карточке.',
                    `<div class="sb-medium">${card(laws('multiple', 'aesthetic jakob'))}</div>`
                )
        )
};
