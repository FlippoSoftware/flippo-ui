import { scrollArea as recipe } from '@flippo-software/component-styles/scroll-area';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const CARDS = () => [
    t('common.hickSLaw'),
    t('common.fittsSLaw'),
    t('common.millerSLaw'),
    t('common.jakobSLaw'),
    t('common.teslerSLaw'),
    t('scrollArea.content.parkinsonSLaw'),
    t('scrollArea.content.postelSLaw'),
    t('scrollArea.content.zeigarnikEffect'),
    t('scrollArea.content.serialPositionEffect'),
    t('scrollArea.content.aestheticUsabilityEffect'),
    t('scrollArea.content.peakEndRule'),
    t('scrollArea.content.occamSRazor')
];

const lines = () =>
    CARDS()
        .map(
            (card, index) =>
                `<div style="display: flex; gap: 12px; padding-block: 10px; padding-inline: 16px"><demo-text color="quaternary" style="font-variant-numeric: tabular-nums">${String(index + 1).padStart(2, '0')}</demo-text><demo-text>${card}</demo-text></div>`
        )
        .join('');

function vertical(attributes = ''): string {
    return `<demo-scroll-area ${attributes} style="block-size: 240px; inline-size: 300px"><demo-scroll-area-viewport><demo-scroll-area-content>${lines()}</demo-scroll-area-content></demo-scroll-area-viewport><demo-scroll-area-scrollbar orientation="vertical"><demo-scroll-area-thumb></demo-scroll-area-thumb></demo-scroll-area-scrollbar></demo-scroll-area>`;
}

const horizontal = () =>
    `<demo-scroll-area style="inline-size: 100%; max-inline-size: 520px"><demo-scroll-area-viewport><demo-scroll-area-content style="display: flex; gap: 12px; padding-block-end: 14px">${CARDS()
        .map(
            (card) =>
                `<div class="sb-card" style="flex: 0 0 160px"><demo-text size="body-minus" weight="stronger">${card}</demo-text></div>`
        )
        .join(
            ''
        )}</demo-scroll-area-content></demo-scroll-area-viewport><demo-scroll-area-scrollbar orientation="horizontal"><demo-scroll-area-thumb></demo-scroll-area-thumb></demo-scroll-area-scrollbar></demo-scroll-area>`;

const markup = vertical('data-story-target');

const meta: Meta<Props> = {
    title: 'Layout/ScrollArea',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'scrollArea.description'
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
            section(t('scrollArea.sections.vertical.title'), t('scrollArea.sections.vertical.description'), row('vertical', vertical())) +
                section(t('scrollArea.sections.horizontal.title'), t('scrollArea.sections.horizontal.description'), horizontal())
        )
};
