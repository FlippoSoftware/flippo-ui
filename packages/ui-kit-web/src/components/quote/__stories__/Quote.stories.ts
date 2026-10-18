import { quote as recipe } from '@flippo-software/component-styles/quote';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = () =>
    `<demo-text as-child><p>${t('common.insideAParagraph')} <demo-quote data-story-target as-child><q>${t('common.aHighlightedFragment')}</q></demo-quote> ${t('common.andPlainText')}</p></demo-text>`;

const meta: Meta<Props> = {
    title: 'Typography/Quote',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: { component: 'quote.description' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const InText: Story = {
    render: () =>
        renderExample(
            `<div class="sb-medium"><demo-text as-child><p>${t('quote.content.millerWroteAbout')} <demo-quote as-child><q>${t('quote.content.theMagicalNumberSeven')}</q></demo-quote>.</p></demo-text></div>`,
            {}
        )
};
