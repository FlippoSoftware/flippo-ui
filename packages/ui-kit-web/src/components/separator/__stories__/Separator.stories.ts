import { separator as recipe } from '@flippo-software/component-styles/separator';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, icon, page, renderExample, row, section, t, triggerButton, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = () =>
    card(
        `<demo-text weight="stronger">${t('separator.content.account')}</demo-text><demo-separator data-story-target spacing="small"></demo-separator><demo-text weight="stronger">${t('common.notifications')}</demo-text>`
    );

const formatting = (name: 'format-bold' | 'format-italic' | 'format-list-ul', label: string) =>
    triggerButton(icon(name), { variant: 'label', iconOnly: true }, `aria-label="${label}"`);

const meta: Meta<Props> = {
    title: 'Layout/Separator',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(`<div class="sb-narrow">${markup()}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: {
                component: 'separator.description'
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
                t('separator.sections.horizontal.title'),
                t('separator.sections.horizontal.description'),
                ['none', 'small', 'medium']
                    .map((inset) =>
                        row(
                            `inset ${inset}`,
                            `<div class="sb-card" style="gap: 0"><demo-text>${t('common.top')}</demo-text><demo-separator inset="${inset}" spacing="medium"></demo-separator><demo-text>${t('common.bottom')}</demo-text></div>`,
                            { fill: true }
                        )
                    )
                    .join('')
            ) +
                section(
                    t('separator.sections.vertical.title'),
                    t('separator.sections.vertical.description'),
                    `<div style="display: flex; align-items: center; gap: 4px">${formatting('format-bold', t('common.bold'))}${formatting('format-italic', t('common.italic'))}<demo-separator orientation="vertical" spacing="small" inset="small"></demo-separator>${formatting('format-list-ul', t('common.list'))}</div>`
                )
        )
};
