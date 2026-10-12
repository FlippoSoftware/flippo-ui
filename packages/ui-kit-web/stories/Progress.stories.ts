import { progress as recipe } from '@flippo-software/component-styles/progress';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { value?: number };

function bar(attributes = '', label = 'Загрузка карточек', value: number | null = 65): string {
    return `<demo-progress ${attributes} ${value === null ? '' : `value="${value}"`}><demo-progress-label>${label}</demo-progress-label><demo-progress-value></demo-progress-value><demo-progress-track><demo-progress-indicator></demo-progress-indicator></demo-progress-track></demo-progress>`;
}

const upload = `<div class="sb-items sb-items--column" data-upload>${bar('', 'Импорт из файла', 0)}<demo-button size="small" variant="secondary" as-child><button type="button">Импортировать</button></demo-button></div>`;

/** Fills the progress bar step by step after a press on the button. */
function animateUpload(root: HTMLElement): void {
    const block = root.querySelector('[data-upload]');
    const progress = block?.querySelector<HTMLElement & { value?: number }>('demo-progress');
    const button = block?.querySelector('button');
    const label = block?.querySelector('demo-progress-label');
    if (!progress || !button || !label) return;
    button.addEventListener('click', () => {
        let value = 0;
        button.disabled = true;
        label.textContent = 'Импорт из файла';
        const timer = setInterval(() => {
            value = Math.min(100, value + 7);
            progress.setAttribute('value', String(value));
            if (value < 100) return;
            clearInterval(timer);
            label.textContent = 'Набор загружен';
            button.disabled = false;
            button.textContent = 'Ещё раз';
        }, 180);
    });
}

const markup = bar('data-story-target');

const meta: Meta<Props> = {
    title: 'Feedback/Progress',
    args: { value: 65 },
    argTypes: { ...variantControls(recipe), value: { control: { type: 'range', min: 0, max: 100, step: 1 } } },
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Ход задачи: подпись, значение и полоса. На 100% полоса становится зелёной (`data-complete`), без `value` — бежит (`data-indeterminate`).'
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
                'В процессе, завершено и неизвестная длительность.',
                row('65%', bar(), { fill: true }) +
                    row('complete', bar('', 'Набор загружен', 100), { fill: true }) +
                    row('indeterminate', bar('', 'Подготовка', null), { fill: true })
            ) +
                section(
                    'Размеры',
                    'Medium — тонкая полоса, large — толще, для заметных операций.',
                    row('medium', bar('size="medium"', 'Загрузка карточек', 40), { fill: true }) +
                        row('large', bar('size="large"', 'Загрузка карточек', 40), { fill: true })
                ) +
                section(
                    'Живой пример',
                    'Импорт набора: значение растёт и в конце полоса меняет цвет.',
                    `<div class="sb-medium">${upload}</div>`
                ),
            animateUpload
        )
};
