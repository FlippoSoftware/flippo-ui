import { container as recipe } from '@flippo-software/component-styles/container';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, resizable, resizableSection, row, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = () =>
    `<demo-container data-story-target class="story-surface"><demo-text>${t('container.content.aContainerLimitsThe')}</demo-text></demo-container>`;

const meta: Meta<Props> = {
    title: 'Layout/Container',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(resizable(markup()), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: { component: 'container.description' }
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
                t('container.sections.sizes.title'),
                t('container.sections.sizes.description'),
                ['xs', 'sm', 'md', 'lg']
                    .map((size) =>
                        row(
                            size,
                            `<demo-container size="${size}" class="story-surface"><demo-text size="body-minus">size="${size}"</demo-text></demo-container>`,
                            { fill: true }
                        )
                    )
                    .join('')
            )
        )
};
