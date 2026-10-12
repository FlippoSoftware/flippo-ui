import { button as recipe } from '@flippo-software/component-styles/button';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { button, card, grid, icon, page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const VARIANTS = ['primary', 'secondary', 'outlined', 'label', 'danger'] as const;
const SIZES = ['large', 'medium', 'small', 'x-small'] as const;

const markup = `<demo-button data-story-target as-child>
<button type="button">${icon('plus')}Создать набор</button>
</demo-button>`;

const meta: Meta<Props> = {
    title: 'Actions/Button',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Кнопка (Figma "Button", "Icon Button"): CTA, Secondary, Outlined, Label и Danger; размеры 56 / 48 / 40 / 24. Нативный `<button>` или `<a>` — через `as-child`; иконки — дочерние `<svg>`.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const loading = `<demo-spinner size="small" color="current" aria-hidden="true"></demo-spinner>`;

export const Gallery: Story = {
    render: () =>
        page(
            section(
                'Варианты',
                'Основное действие экрана — primary; остальные варианты — по убыванию акцента.',
                VARIANTS.map((variant) =>
                    row(
                        variant,
                        button(`${icon('plus')}Кнопка`, `variant="${variant}"`) +
                            button(`Далее${icon('chevron-right')}`, `variant="${variant}"`) +
                            `<demo-button variant="${variant}" icon-only as-child><button type="button" aria-label="Добавить">${icon('plus')}</button></demo-button>` +
                            `<demo-button variant="${variant}" as-child><button type="button" disabled>Недоступно</button></demo-button>`
                    )
                ).join('')
            ) +
                section(
                    'Размеры',
                    'Large 56, Medium 48, Small 40, X-Small 24. Иконка-кнопка остаётся кругом того же размера.',
                    SIZES.map((size) =>
                        row(
                            size,
                            button(`${icon('plus')}Создать набор`, `size="${size}"`) +
                                button('Отмена', `size="${size}" variant="secondary"`) +
                                `<demo-button size="${size}" variant="secondary" icon-only as-child><button type="button" aria-label="Настройки">${icon('settings')}</button></demo-button>` +
                                `<demo-button size="${size}" variant="label" icon-only as-child><button type="button" aria-label="Ещё">${icon('dots-vertical')}</button></demo-button>`
                        )
                    ).join('')
                ) +
                section(
                    'Состояния',
                    'Загрузка: `aria-busy` и спиннер цвета текста, кнопка недоступна. Ссылка выглядит как кнопка через `as-child`.',
                    row(
                        'loading',
                        `<demo-button as-child><button type="button" aria-busy="true" disabled>${loading}Сохраняю…</button></demo-button>` +
                            `<demo-button variant="secondary" as-child><button type="button" aria-busy="true" disabled>${loading}Загрузка</button></demo-button>`
                    ) +
                        row(
                            'link',
                            `<demo-button variant="outlined" as-child><a href="#set">Открыть набор${icon('arrow-outward')}</a></demo-button>`
                        )
                )
        )
};

export const Examples: Story = {
    render: () =>
        page(
            section(
                'В интерфейсе',
                'Типичные сочетания кнопок из экранов Flippo.',
                grid(
                    card(
                        `<p class="sb-section-text">У вас пока нет наборов. Создайте первый или загрузите из файла.</p><div class="sb-items">${button(`${icon('plus')}Создать набор`)}${button('Загрузить', 'variant="outlined"')}</div>`,
                        'Пустая коллекция'
                    ) +
                        card(
                            `<p class="sb-section-text">Удалить «Экзамен Законы UX» и 7 карточек?</p><div class="sb-items">${button('Отмена', 'variant="label"')}${button(`${icon('delete')}Удалить`, 'variant="danger"')}</div>`,
                            'Подтверждение'
                        ) +
                        card(
                            `<div class="sb-items">${button(`${icon('hint')}Доб. подсказку`, 'size="small" variant="secondary"')}${button(`${icon('bookmark')}В готовые`, 'size="small" variant="secondary"')}<demo-button size="small" variant="label" icon-only as-child><button type="button" aria-label="Ещё">${icon('dots-horizontal')}</button></demo-button></div>`,
                            'Панель карточки'
                        ),
                    300
                )
            )
        )
};
