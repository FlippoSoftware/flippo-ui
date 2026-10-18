import { kbd as recipe } from '@flippo-software/component-styles/kbd';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const kbd = (content: string, attributes = '') => `<demo-kbd ${attributes} as-child><kbd>${content}</kbd></demo-kbd>`;

const markup = kbd('⌘ K', 'data-story-target');

const meta: Meta<Props> = {
    title: 'Typography/Kbd',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'kbd.description' }
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
                t('kbd.sections.variants.title'),
                '',
                ['outline', 'soft', 'ghost']
                    .map((variant) => row(variant, ['Space', '←', '→'].map((key) => kbd(key, `variant="${variant}"`)).join('')))
                    .join('')
            ) +
                section(
                    t('kbd.sections.sizes.title'),
                    '',
                    row('size', ['1', '2', '3', '4', '5'].map((size) => kbd('Esc', `size="${size}"`)).join(''))
                ) +
                section(
                    t('kbd.sections.reviewHint.title'),
                    '',
                    `<demo-text color="tertiary" as-child><p>${kbd('Space')} ${t('kbd.content.toFlipTheCard')} ${kbd('←')} ${t('kbd.content.iDonTRemember')} ${kbd('→')} ${t('kbd.content.iRemember')}</p></demo-text>`
                )
        )
};
