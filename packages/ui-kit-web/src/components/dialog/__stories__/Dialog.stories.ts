import { dialog as recipe } from '@flippo-software/component-styles/dialog';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, t, textInput, triggerButton, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function close(label: string, variant: 'label' | 'primary' | 'danger'): string {
    return `<demo-dialog-close as-child>${triggerButton(label, { variant })}</demo-dialog-close>`;
}

function deleteSet(attributes = ''): string {
    return `<demo-dialog ${attributes}>
<demo-dialog-trigger as-child>${triggerButton(`${icon('delete')}${t('common.deleteTheSet')}`, { variant: 'danger' })}</demo-dialog-trigger>
<demo-dialog-backdrop></demo-dialog-backdrop>
<demo-dialog-popup>
<demo-dialog-title>${t('dialog.content.deleteTheSet')}</demo-dialog-title>
<demo-dialog-description>${t('dialog.content.uxLawsExamAnd')}</demo-dialog-description>
<demo-dialog-actions>${close(t('common.cancel'), 'label')}${close(t('common.delete'), 'danger')}</demo-dialog-actions>
<demo-dialog-close aria-label="${t('common.close')}"></demo-dialog-close>
</demo-dialog-popup>
</demo-dialog>`;
}

function renameSet(attributes = '', label = t('common.rename')): string {
    return `<demo-dialog ${attributes}>
<demo-dialog-trigger as-child>${triggerButton(`${icon('pencil')}${label}`, { variant: 'secondary' })}</demo-dialog-trigger>
<demo-dialog-backdrop></demo-dialog-backdrop>
<demo-dialog-popup>
<demo-dialog-title>${t('dialog.content.newName')}</demo-dialog-title>
<demo-field name="title"><demo-field-label>${t('common.setName')}</demo-field-label>${textInput('appearance="inverted"', '', { control: `default-value="${t('common.uxLawsExam')}"` })}</demo-field>
<demo-dialog-actions>${close(t('common.cancel'), 'label')}${close(t('common.save'), 'primary')}</demo-dialog-actions>
<demo-dialog-close aria-label="${t('common.close')}"></demo-dialog-close>
</demo-dialog-popup>
</demo-dialog>`;
}

const markup = deleteSet('data-story-target');

const meta: Meta<Props> = {
    title: 'Overlays/Dialog',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'dialog.descriptionWeb'
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
                t('dialog.sections.confirmationAndForm.title'),
                t('dialog.sections.confirmationAndForm.description'),
                row('confirm', deleteSet()) + row('form', renameSet())
            ) +
                section(
                    t('dialog.sections.sizes.title'),
                    t('dialog.sections.sizes.description'),
                    row(
                        'sizes',
                        renameSet('size="small"', 'Small') + renameSet('size="medium"', 'Medium') + renameSet('size="large"', 'Large')
                    )
                )
        )
};
