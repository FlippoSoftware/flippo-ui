import { meter as recipe } from '@flippo-software/component-styles/meter';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { value?: number };

function gauge(attributes = '', value = 72, label = 'Выучено карточек'): string {
    return `<demo-meter ${attributes} value="${value}" min="0" max="100"><demo-meter-label>${label}</demo-meter-label><demo-meter-value></demo-meter-value><demo-meter-track><demo-meter-indicator></demo-meter-indicator></demo-meter-track></demo-meter>`;
}

const markup = gauge('data-story-target');

const meta: Meta<Props> = {
    title: 'Feedback/Meter',
    args: { value: 72 },
    argTypes: { ...variantControls(recipe), value: { control: { type: 'range', min: 0, max: 100, step: 1 } } },
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Измеритель: доля от известного диапазона (заполненность, прогресс обучения). Выглядит как Progress, но это не ход задачи.'
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
                'Значения',
                'Пусто, частично и полностью.',
                row('0%', gauge('', 0), { fill: true }) +
                    row('72%', gauge(), { fill: true }) +
                    row('100%', gauge('', 100, 'Набор выучен'), { fill: true })
            ) +
                section(
                    'Размеры',
                    'Medium и large.',
                    row('medium', gauge('size="medium"', 48, 'Хранилище'), { fill: true }) +
                        row('large', gauge('size="large"', 48, 'Хранилище'), { fill: true })
                )
        )
};
