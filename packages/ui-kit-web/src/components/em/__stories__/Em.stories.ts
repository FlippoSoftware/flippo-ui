import { em as recipe } from '@flippo-software/component-styles/em';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = () =>
    `<demo-text as-child><p>${t('common.insideAParagraph')} <demo-em data-story-target as-child><em>${t('common.aHighlightedFragment')}</em></demo-em> ${t('common.andPlainText')}</p></demo-text>`;

const meta: Meta<Props> = {
    title: 'Typography/Em',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup(), args),
    parameters: { docs: { source: { code: markup(), language: 'html' }, description: { component: 'em.description' } } }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const InText: Story = {
    render: () =>
        renderExample(
            `<div class="sb-medium"><demo-text as-child><p>${t('em.content.theCardHasTo')} <demo-em as-child><em>${t('em.content.today')}</em></demo-em>${t('em.content.orTheIntervalIs')}</p></demo-text></div>`,
            {}
        )
};
