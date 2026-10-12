import { blockquote as recipe } from '@flippo-software/component-styles/blockquote';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

const TEXT = 'Пользователи проводят большую часть времени на других сайтах и ожидают, что ваш будет работать так же.';

const quote = (attributes = '') => `<demo-blockquote ${attributes} as-child><blockquote>${TEXT}</blockquote></demo-blockquote>`;

const markup = quote('data-story-target');

const meta: Meta<Props> = {
    title: 'Typography/Blockquote',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Цитата-абзац с акцентной чертой слева. Три размера и цвета черты.' }
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
                'Цвета',
                'Закон Якоба.',
                ['primary', 'brand', 'success', 'warning', 'error']
                    .map((color) => row(color, quote(`color="${color}"`), { fill: true }))
                    .join('')
            ) + section('Размеры', '', ['1', '2', '3'].map((size) => row(size, quote(`size="${size}"`), { fill: true })).join(''))
        )
};
