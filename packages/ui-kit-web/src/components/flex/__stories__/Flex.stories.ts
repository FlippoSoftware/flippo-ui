import { flex as recipe } from '@flippo-software/component-styles/flex';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, resizable, resizableSection, row, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { direction?: 'row' | 'column'; gap?: string };

const tiles = (count = 3) =>
    Array.from({ length: count }, (_, index) => `<demo-box p="12px" class="story-surface">${index + 1}</demo-box>`).join('');

const markup = `<demo-flex data-story-target gap="12px">${tiles()}</demo-flex>`;

const meta: Meta<Props> = {
    title: 'Layout/Flex',
    args: { direction: 'row', gap: '12px' },
    argTypes: { ...variantControls(recipe), direction: { control: 'select', options: ['row', 'column'] }, gap: { control: 'text' } },
    render: (args: Props) => renderExample(resizable(markup), args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'flex.descriptionWeb' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () =>
        page(
            resizableSection(
                t('flex.sections.direction.title'),
                '',
                row('row', `<demo-flex gap="8px">${tiles()}</demo-flex>`) +
                    row('column', `<demo-flex direction="column" gap="8px">${tiles()}</demo-flex>`)
            ) +
                resizableSection(
                    t('flex.sections.distribution.title'),
                    t('flex.sections.distribution.description'),
                    ['flex-start', 'center', 'space-between', 'flex-end']
                        .map((justify) =>
                            row(justify, `<demo-flex justify="${justify}" gap="8px" width="100%">${tiles()}</demo-flex>`, { fill: true })
                        )
                        .join('')
                ) +
                resizableSection(
                    t('flex.sections.wrapping.title'),
                    t('flex.sections.wrapping.description'),
                    `<demo-flex wrap="wrap" gap="8px" max-width="320px">${tiles(9)}</demo-flex>`
                )
        )
};
