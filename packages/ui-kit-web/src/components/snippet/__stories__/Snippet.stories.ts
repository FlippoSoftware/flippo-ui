import { snippet as recipe } from '@flippo-software/component-styles/snippet';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function snippet(lines: string[], attributes = '', label = t('snippet.content.copyTheCommand')): string {
    return `<demo-snippet ${attributes}>${lines.map((line) => `<demo-snippet-line><demo-snippet-symbol></demo-snippet-symbol>${line}</demo-snippet-line>`).join('')}<demo-snippet-copy-button aria-label="${label}"></demo-snippet-copy-button></demo-snippet>`;
}

const markup = snippet(['pnpm add @flippo-software/ui-kit-web'], 'data-story-target');

const meta: Meta<Props> = {
    title: 'Display/Snippet',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'snippet.description'
            }
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
                t('snippet.sections.severalLines.title'),
                t('snippet.sections.severalLines.descriptionWeb'),
                `<div class="sb-medium">${snippet(['pnpm add @flippo-software/ui-kit-web', 'pnpm add @flippo-software/component-styles'], '', t('snippet.content.copyTheCommands'))}</div>`
            ) +
                section(
                    t('snippet.sections.customSymbol.title'),
                    t('snippet.sections.customSymbol.description'),
                    `<div class="sb-medium">${snippet(["flippo.study('ux-laws-exam')"], 'symbol="&gt;"', t('snippet.content.copy'))}</div>`
                )
        )
};
