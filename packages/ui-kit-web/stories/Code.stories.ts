import { code as recipe } from '@flippo-software/component-styles/code';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, row, section } from './kit';

import type { VariantProps } from './helpers';

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
            description: { component: 'Код внутри текста: моноширинный шрифт и подложка. Размер 1–9 и четыре варианта.' }
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
                ['soft', 'solid', 'outline', 'ghost'].map((variant) => row(variant, code('npm run build', `variant="${variant}"`))).join('')
            ) +
                section('Размеры', '', row('size', ['1', '2', '3', '4', '5'].map((size) => code('map()', `size="${size}"`)).join(''))) +
                section(
                    'В тексте',
                    '',
                    `<demo-text as-child><p>Метод ${code('Array.prototype.map')} возвращает новый массив, а ${code('forEach')} — ${code('undefined')}.</p></demo-text>`
                )
        )
};
