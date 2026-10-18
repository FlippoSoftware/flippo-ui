import { blockquote as recipe } from '@flippo-software/component-styles/blockquote';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const TEXT = () => t('blockquote.content.usersSpendMostOf');

const quote = (attributes = '') => `<demo-blockquote ${attributes} as-child><blockquote>${TEXT()}</blockquote></demo-blockquote>`;

const markup = quote('data-story-target');

const meta: Meta<Props> = {
    title: 'Typography/Blockquote',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'blockquote.description' }
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
                t('blockquote.sections.colours.title'),
                t('blockquote.sections.colours.description'),
                ['primary', 'brand', 'success', 'warning', 'error']
                    .map((color) => row(color, quote(`color="${color}"`), { fill: true }))
                    .join('')
            ) +
                section(
                    t('blockquote.sections.sizes.title'),
                    '',
                    ['1', '2', '3'].map((size) => row(size, quote(`size="${size}"`), { fill: true })).join('')
                )
        )
};
