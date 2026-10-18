import { button as recipe } from '@flippo-software/component-styles/button';

import type { Meta, StoryObj } from '@storybook/web-components';

import { button, card, grid, icon, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const VARIANTS = ['primary', 'secondary', 'outlined', 'label', 'danger'] as const;
const SIZES = ['large', 'medium', 'small', 'x-small'] as const;

const markup = () => `<demo-button data-story-target as-child>
<button type="button">${icon('plus')}${t('common.createASet')}</button>
</demo-button>`;

const meta: Meta<Props> = {
    title: 'Actions/Button',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: {
                component: 'button.descriptionWeb'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const loading = `<demo-spinner size="small" color="current" aria-hidden="true"></demo-spinner>`;

export const Gallery: Story = {
    render: () =>
        page(
            section(
                t('button.sections.variants.title'),
                t('button.sections.variants.description'),
                VARIANTS.map((variant) =>
                    row(
                        variant,
                        button(`${icon('plus')}${t('button.content.button')}`, `variant="${variant}"`) +
                            button(`${t('button.content.next')}${icon('chevron-right')}`, `variant="${variant}"`) +
                            `<demo-button variant="${variant}" icon-only as-child><button type="button" aria-label="${t('button.labels.add')}">${icon('plus')}</button></demo-button>` +
                            `<demo-button variant="${variant}" as-child><button type="button" disabled>${t('common.disabled')}</button></demo-button>`
                    )
                ).join('')
            ) +
                section(
                    t('button.sections.sizes.title'),
                    t('button.sections.sizes.description'),
                    SIZES.map((size) =>
                        row(
                            size,
                            button(`${icon('plus')}${t('common.createASet')}`, `size="${size}"`) +
                                button(t('common.cancel'), `size="${size}" variant="secondary"`) +
                                `<demo-button size="${size}" variant="secondary" icon-only as-child><button type="button" aria-label="${t('button.labels.settings')}">${icon('settings')}</button></demo-button>` +
                                `<demo-button size="${size}" variant="label" icon-only as-child><button type="button" aria-label="${t('button.labels.more')}">${icon('dots-vertical')}</button></demo-button>`
                        )
                    ).join('')
                ) +
                section(
                    t('button.sections.states.title'),
                    t('button.sections.states.descriptionWeb'),
                    row(
                        'loading',
                        `<demo-button as-child><button type="button" aria-busy="true" disabled>${loading}${t('button.content.saving')}</button></demo-button>` +
                            `<demo-button variant="secondary" as-child><button type="button" aria-busy="true" disabled>${loading}${t('common.loading')}</button></demo-button>`
                    ) +
                        row(
                            'link',
                            `<demo-button variant="outlined" as-child><a href="#set">${t('common.openTheSet')}${icon('arrow-outward')}</a></demo-button>`
                        )
                )
        )
};

export const Examples: Story = {
    render: () =>
        page(
            section(
                t('button.sections.inAnInterface.title'),
                t('button.sections.inAnInterface.description'),
                grid(
                    card(
                        `<p class="sb-section-text">${t('button.content.youHaveNoSets')}</p><div class="sb-items">${button(`${icon('plus')}${t('common.createASet')}`)}${button(t('button.content.upload'), 'variant="outlined"')}</div>`,
                        t('button.content.emptyCollection')
                    ) +
                        card(
                            `<p class="sb-section-text">${t('button.content.deleteUxLawsExam')}</p><div class="sb-items">${button(t('common.cancel'), 'variant="label"')}${button(`${icon('delete')}${t('common.delete')}`, 'variant="danger"')}</div>`,
                            t('button.content.confirmation')
                        ) +
                        card(
                            `<div class="sb-items">${button(`${icon('hint')}${t('button.content.addAHint')}`, 'size="small" variant="secondary"')}${button(`${icon('bookmark')}${t('common.markAsDone')}`, 'size="small" variant="secondary"')}<demo-button size="small" variant="label" icon-only as-child><button type="button" aria-label="${t('button.labels.more')}">${icon('dots-horizontal')}</button></demo-button></div>`,
                            t('button.content.cardToolbar')
                        ),
                    300
                )
            )
        )
};
