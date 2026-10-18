import { segmentedControl as recipe } from '@flippo-software/component-styles/segmented-control';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function segment(value: string, content: string, attributes = ''): string {
    return `<demo-segmented-control-item value="${value}" ${attributes} as-child><button type="button">${content}</button></demo-segmented-control-item>`;
}

function period(attributes = ''): string {
    return `<demo-segmented-control ${attributes} default-value="week" aria-label="${t('segmentedControl.labels.statisticsPeriod')}">${segment('day', t('common.day'))}${segment('week', t('common.week'))}${segment('month', t('common.month'))}${segment('year', t('segmentedControl.content.year'), 'disabled')}</demo-segmented-control>`;
}

const markup = period('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/SegmentedControl',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'segmentedControl.description' }
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
                t('segmentedControl.sections.sizes.title'),
                t('segmentedControl.sections.sizes.description'),
                (['small', 'medium', 'large'] as const).map((size) => row(size, period(`size="${size}"`))).join('')
            ) +
                section(
                    t('segmentedControl.sections.withIconsAndDisabled.title'),
                    t('segmentedControl.sections.withIconsAndDisabled.description'),
                    row(
                        'icons',
                        `<demo-segmented-control default-value="cards" aria-label="${t('common.view')}">${segment('list', `${icon('format-list-ul')}${t('common.list')}`)}${segment('cards', `${icon('set')}${t('common.cards')}`)}</demo-segmented-control>`
                    ) + row('disabled', period('disabled'))
                )
        )
};
