import { code as recipe } from '@flippo-software/component-styles/code';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const code = (content: string, attributes = '') => `<demo-code ${attributes} as-child><code>${content}</code></demo-code>`;

const markup = code('useToastManager()', 'data-story-target');

const meta: Meta<Props> = {
    title: 'Typography/Code',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'code.description' }
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
                t('code.sections.variants.title'),
                '',
                ['soft', 'solid', 'outline', 'ghost'].map((variant) => row(variant, code('npm run build', `variant="${variant}"`))).join('')
            ) +
                section(
                    t('code.sections.sizes.title'),
                    '',
                    row('size', ['1', '2', '3', '4', '5'].map((size) => code('map()', `size="${size}"`)).join(''))
                ) +
                section(
                    t('code.sections.inAText.title'),
                    '',
                    `<demo-text as-child><p>${t('code.content.theMethod')} ${code('Array.prototype.map')} ${t('code.content.returnsANewArray')} ${code('forEach')} — ${code('undefined')}.</p></demo-text>`
                )
        )
};
