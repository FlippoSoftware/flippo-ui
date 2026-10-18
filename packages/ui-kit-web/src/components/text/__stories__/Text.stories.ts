import { text as recipe } from '@flippo-software/component-styles/text';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = () => `<demo-text data-story-target as-child><p>${t('text.content.hickSLawDecision')}</p></demo-text>`;

const SIZES = [
    'display-1',
    'display-2',
    'title-1',
    'title-2',
    'title-3',
    'heading-1',
    'heading-2',
    'heading-3',
    'body-plus',
    'body',
    'body-minus',
    'label'
];
const COLORS = ['primary', 'secondary', 'tertiary', 'quaternary', 'disabled', 'brand', 'success', 'warning', 'error'];

const text = (attributes: string, content: string) => `<demo-text ${attributes}>${content}</demo-text>`;

const meta: Meta<Props> = {
    title: 'Typography/Text',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: {
                component: 'text.descriptionWeb'
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
                t('text.sections.scale.title'),
                t('text.sections.scale.description'),
                SIZES.map((size) => row(size, text(`size="${size}" truncate`, t('common.uxLawsExam')))).join('')
            ) +
                section(
                    t('text.sections.weight.title'),
                    '',
                    ['weaker', 'default', 'stronger']
                        .map((weight) => row(weight, text(`size="body-plus" weight="${weight}"`, t('text.content.reviewHardCardsMore'))))
                        .join('')
                ) +
                section(
                    t('text.sections.colours.title'),
                    '',
                    row('color', COLORS.map((color) => text(`color="${color}"`, color)).join(''))
                ) +
                section(
                    t('text.sections.truncation.title'),
                    t('text.sections.truncation.description'),
                    `<div class="sb-narrow">${text('truncate style="display: block"', t('text.content.javascriptClosuresExecutionContext'))}</div>`
                )
        )
};
