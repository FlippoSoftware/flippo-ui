import { skeleton as recipe } from '@flippo-software/component-styles/skeleton';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { card, grid, page, row, section } from './kit';

import type { VariantProps } from './helpers';

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
                component:
                    'Заглушка на время загрузки: прямоугольник или круг (`circle`) нужного размера; анимации pulse, shimmer или без неё.'
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
                'Анимация',
                'Pulse мерцает целиком, shimmer пробегает бликом, none — статичная заливка.',
                ['pulse', 'shimmer', 'none']
                    .map((animation) =>
                        row(animation, block(`animation="${animation}" circle`, 40, 40) + block(`animation="${animation}"`, 200, 40))
                    )
                    .join('')
            ) +
                section(
                    'Карточки при загрузке',
                    'Сетка наборов, пока данные не пришли.',
                    grid(setCardSkeleton() + setCardSkeleton('shimmer') + setCardSkeleton(), 220)
                )
        )
};
