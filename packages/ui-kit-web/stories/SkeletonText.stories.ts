import { skeletonText as recipe } from '@flippo-software/component-styles/skeleton-text';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { lines?: number };

const markup = '<demo-skeleton-text data-story-target lines="3"></demo-skeleton-text>';

const STYLES = [
    ['fl-text-heading-3-default', 'Экзамен Законы UX', 1],
    ['fl-text-body-default', 'Закон Хика: время принятия решения растёт с числом и сложностью вариантов выбора.', 3],
    ['fl-text-body-minus-default', 'Создано 12 октября · 32 карточки', 1]
] as const;

const meta: Meta<Props> = {
    title: 'Feedback/SkeletonText',
    args: { lines: 3 },
    argTypes: { ...variantControls(recipe), lines: { control: { type: 'range', min: 1, max: 10, step: 1 } } },
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Заглушка абзаца. Строки занимают ровно высоту строки текущего шрифта (`1lh`), а полоса — 0.7em: подставьте заглушку в любой стиль текста, и при загрузке макет не сдвинется. Последняя строка короче.'
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
                'Подстраивается под шрифт',
                'Слева — заглушка в стиле текста, справа — сам текст. Высота блоков совпадает.',
                STYLES.map(([className, text, lines]) =>
                    row(
                        className.replace('fl-text-', ''),
                        `<div class="${className}" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; inline-size: 100%; align-items: start"><demo-skeleton-text lines="${lines}"></demo-skeleton-text><span>${text}</span></div>`
                    )
                ).join('')
            ) +
                section(
                    'Анимация',
                    '',
                    ['pulse', 'shimmer', 'none']
                        .map((animation) =>
                            row(animation, `<demo-skeleton-text lines="3" animation="${animation}"></demo-skeleton-text>`, { fill: true })
                        )
                        .join('')
                )
        )
};
