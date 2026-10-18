import { skeletonText as recipe } from '@flippo-software/component-styles/skeleton-text';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { lines?: number };

const markup = '<demo-skeleton-text data-story-target lines="3"></demo-skeleton-text>';

const STYLES = () =>
    [
        ['fl-text-heading-3-default', t('common.uxLawsExam'), 1],
        ['fl-text-body-default', t('skeletonText.content.hickSLawThe'), 3],
        ['fl-text-body-minus-default', t('skeletonText.content.createdOnOctober12'), 1]
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
                component: 'skeletonText.description'
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
                t('skeletonText.sections.followsTheFont.title'),
                t('skeletonText.sections.followsTheFont.description'),
                STYLES()
                    .map(([className, text, lines]) =>
                        row(
                            className.replace('fl-text-', ''),
                            `<div class="${className}" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; inline-size: 100%; align-items: start"><demo-skeleton-text lines="${lines}"></demo-skeleton-text><span>${text}</span></div>`
                        )
                    )
                    .join('')
            ) +
                section(
                    t('skeletonText.sections.animation.title'),
                    '',
                    ['pulse', 'shimmer', 'none']
                        .map((animation) =>
                            row(animation, `<demo-skeleton-text lines="3" animation="${animation}"></demo-skeleton-text>`, { fill: true })
                        )
                        .join('')
                )
        )
};
