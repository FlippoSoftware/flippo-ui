import { section as recipe } from '@flippo-software/component-styles/section';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, resizable, resizableSection, row, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = () =>
    `<demo-section data-story-target class="story-surface"><demo-text size="heading-3">${t('section.content.mySets')}</demo-text><demo-text color="tertiary">${t('section.content.theVerticalPaddingOf')}</demo-text></demo-section>`;

const meta: Meta<Props> = {
    title: 'Layout/Section',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(resizable(markup()), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: { component: 'section.description' }
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
                t('section.sections.sizes.title'),
                t('section.sections.sizes.description'),
                ['sm', 'md', 'lg', 'xl']
                    .map((size) =>
                        row(
                            size,
                            `<demo-section size="${size}" class="story-surface"><demo-text size="body-minus">size="${size}"</demo-text></demo-section>`,
                            { fill: true }
                        )
                    )
                    .join('')
            )
        )
};
