import { spinner as recipe } from '@flippo-software/component-styles/spinner';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = () => `<demo-spinner data-story-target role="status" aria-label="${t('common.loading')}"></demo-spinner>`;

const meta: Meta<Props> = {
    title: 'Feedback/Spinner',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: { component: 'spinner.description' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const spinner = (attributes: string, label: string) => `<demo-spinner ${attributes} role="status" aria-label="${label}"></demo-spinner>`;
const loading = '<demo-spinner size="x-small" color="current" aria-hidden="true"></demo-spinner>';

export const Gallery: Story = {
    render: () =>
        page(
            section(
                t('spinner.sections.sizes.title'),
                '',
                row('size', ['x-small', 'small', 'medium', 'large'].map((size) => spinner(`size="${size}"`, size)).join(''))
            ) +
                section(
                    t('spinner.sections.colours.title'),
                    '',
                    row(
                        'color',
                        ['brand', 'success', 'info', 'warning', 'danger', 'current']
                            .map((color) => spinner(`color="${color}"`, color))
                            .join('')
                    )
                ) +
                section(
                    t('spinner.sections.inAButton.title'),
                    t('spinner.sections.inAButton.description'),
                    row(
                        'loading',
                        `<demo-button as-child><button type="button" disabled>${loading}${t('spinner.content.saving')}</button></demo-button><demo-button variant="secondary" as-child><button type="button" disabled>${loading}${t('common.loading')}</button></demo-button>`
                    )
                )
        )
};
