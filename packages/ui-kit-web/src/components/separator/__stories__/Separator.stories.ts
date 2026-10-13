import { separator as recipe } from '@flippo-software/component-styles/separator';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, icon, page, renderExample, row, section, triggerButton, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = card(
    '<demo-text weight="stronger">Аккаунт</demo-text><demo-separator data-story-target spacing="small"></demo-separator><demo-text weight="stronger">Уведомления</demo-text>'
);

const formatting = (name: 'format-bold' | 'format-italic' | 'format-list-ul', label: string) =>
    triggerButton(icon(name), { variant: 'label', iconOnly: true }, `aria-label="${label}"`);

const meta: Meta<Props> = {
    title: 'Layout/Separator',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(`<div class="sb-narrow">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Разделитель (Figma "Divider"): линия толщиной 1px, длина — от контейнера. `spacing` — отступ поперёк линии, `inset` — вдоль (Figma "Padding=12px 6px" это `inset="medium" spacing="small"`).'
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
                'Горизонтальный',
                'Отступы поперёк линии и вдоль неё.',
                ['none', 'small', 'medium']
                    .map((inset) =>
                        row(
                            `inset ${inset}`,
                            `<div class="sb-card" style="gap: 0"><demo-text>Сверху</demo-text><demo-separator inset="${inset}" spacing="medium"></demo-separator><demo-text>Снизу</demo-text></div>`,
                            { fill: true }
                        )
                    )
                    .join('')
            ) +
                section(
                    'Вертикальный',
                    '`orientation="vertical"` в строке: высота — от строки, `inset` укорачивает линию.',
                    `<div style="display: flex; align-items: center; gap: 4px">${formatting('format-bold', 'Жирный')}${formatting('format-italic', 'Курсив')}<demo-separator orientation="vertical" spacing="small" inset="small"></demo-separator>${formatting('format-list-ul', 'Список')}</div>`
                )
        )
};
