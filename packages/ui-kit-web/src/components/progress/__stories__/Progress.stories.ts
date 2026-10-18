import { progress as recipe } from '@flippo-software/component-styles/progress';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { value?: number };

function bar(attributes = '', label = t('progress.content.loadingCards'), value: number | null = 65): string {
    return `<demo-progress ${attributes} ${value === null ? '' : `value="${value}"`}><demo-progress-label>${label}</demo-progress-label><demo-progress-value></demo-progress-value><demo-progress-track><demo-progress-indicator></demo-progress-indicator></demo-progress-track></demo-progress>`;
}

const upload = () =>
    `<div class="sb-items sb-items--column" data-upload>${bar('', t('progress.content.importFromAFile'), 0)}<demo-button size="small" variant="secondary" as-child><button type="button">${t('progress.content.import')}</button></demo-button></div>`;

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
        label.textContent = t('progress.content.importFromAFile');
        const timer = setInterval(() => {
            value = Math.min(100, value + 7);
            progress.setAttribute('value', String(value));
            if (value < 100) return;
            clearInterval(timer);
            label.textContent = t('progress.content.setLoaded');
            button.disabled = false;
            button.textContent = t('progress.content.tryAgain');
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
                component: 'progress.descriptionWeb'
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
                t('progress.sections.states.title'),
                t('progress.sections.states.description'),
                row('65%', bar(), { fill: true }) +
                    row('complete', bar('', t('progress.content.setLoaded'), 100), { fill: true }) +
                    row('indeterminate', bar('', t('progress.content.preparing'), null), { fill: true })
            ) +
                section(
                    t('progress.sections.sizes.title'),
                    t('progress.sections.sizes.description'),
                    row('medium', bar('size="medium"', t('progress.content.loadingCards'), 40), { fill: true }) +
                        row('large', bar('size="large"', t('progress.content.loadingCards'), 40), { fill: true })
                ) +
                section(
                    t('progress.sections.liveExample.title'),
                    t('progress.sections.liveExample.description'),
                    `<div class="sb-medium">${upload()}</div>`
                ),
            animateUpload
        )
};
