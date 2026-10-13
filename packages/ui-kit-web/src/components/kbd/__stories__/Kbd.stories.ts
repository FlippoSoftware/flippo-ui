import { kbd as recipe } from '@flippo-software/component-styles/kbd';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, variantControls } from '~@stories';

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
            description: { component: 'Клавиша или сочетание клавиш в подсказках и меню.' }
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
                'Варианты',
                '',
                ['outline', 'soft', 'ghost']
                    .map((variant) => row(variant, ['Space', '←', '→'].map((key) => kbd(key, `variant="${variant}"`)).join('')))
                    .join('')
            ) +
                section('Размеры', '', row('size', ['1', '2', '3', '4', '5'].map((size) => kbd('Esc', `size="${size}"`)).join(''))) +
                section(
                    'Подсказка к повторению',
                    '',
                    `<demo-text color="tertiary" as-child><p>${kbd('Space')} — перевернуть карточку, ${kbd('←')} — не помню, ${kbd('→')} — помню.</p></demo-text>`
                )
        )
};
