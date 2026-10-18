import { meter as recipe } from '@flippo-software/component-styles/meter';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { value?: number };

function gauge(attributes = '', value = 72, label = t('meter.content.cardsLearned')): string {
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
                component: 'meter.description'
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
                t('meter.sections.values.title'),
                t('meter.sections.values.description'),
                row('0%', gauge('', 0), { fill: true }) +
                    row('72%', gauge(), { fill: true }) +
                    row('100%', gauge('', 100, t('meter.content.setLearned')), { fill: true })
            ) +
                section(
                    t('meter.sections.sizes.title'),
                    t('meter.sections.sizes.description'),
                    row('medium', gauge('size="medium"', 48, t('meter.content.storage')), { fill: true }) +
                        row('large', gauge('size="large"', 48, t('meter.content.storage')), { fill: true })
                )
        )
};
