import { strong as recipe } from '@flippo-software/component-styles/strong';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = () =>
    `<demo-text as-child><p>${t('common.insideAParagraph')} <demo-strong data-story-target as-child><strong>${t('common.aHighlightedFragment')}</strong></demo-strong> ${t('common.andPlainText')}</p></demo-text>`;

const meta: Meta<Props> = {
    title: 'Typography/Strong',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: { source: { code: markup(), language: 'html' }, description: { component: 'strong.description' } }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const InText: Story = {
    render: () =>
        renderExample(
            `<div class="sb-medium"><demo-text as-child><p>${t('strong.content.aDeletedSet')} <demo-strong as-child><strong>${t('strong.content.cannotBeRestored')}</strong></demo-strong>.</p></demo-text></div>`,
            {}
        )
};
