import { skeleton as recipe } from '@flippo-software/component-styles/skeleton';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, grid, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { width?: string; height?: string };

const markup = '<demo-skeleton data-story-target width="240px" height="80px"></demo-skeleton>';

const block = (attributes: string, width: number, height: number) =>
    `<demo-skeleton ${attributes} width="${width}px" height="${height}px"></demo-skeleton>`;

/** A set card while it loads: the same paddings as the real card, blocks in place of the content. */
function setCardSkeleton(animation = 'pulse'): string {
    const attributes = `animation="${animation}"`;
    return card(
        `${block(attributes, 96, 14)}<demo-skeleton-text lines="2" ${attributes}></demo-skeleton-text><div style="display: flex; align-items: center; gap: 8px; margin-block-start: 4px">${block(`${attributes} circle`, 24, 24)}${block(attributes, 120, 12)}</div>`
    );
}

const meta: Meta<Props> = {
    title: 'Feedback/Skeleton',
    args: { width: '240px', height: '80px' },
    argTypes: { ...variantControls(recipe), width: { control: 'text' }, height: { control: 'text' } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'skeleton.descriptionWeb'
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
                t('skeleton.sections.animation.title'),
                t('skeleton.sections.animation.description'),
                ['pulse', 'shimmer', 'none']
                    .map((animation) =>
                        row(animation, block(`animation="${animation}" circle`, 40, 40) + block(`animation="${animation}"`, 200, 40))
                    )
                    .join('')
            ) +
                section(
                    t('skeleton.sections.cardsWhileLoading.title'),
                    t('skeleton.sections.cardsWhileLoading.description'),
                    grid(setCardSkeleton() + setCardSkeleton('shimmer') + setCardSkeleton(), 220)
                )
        )
};
