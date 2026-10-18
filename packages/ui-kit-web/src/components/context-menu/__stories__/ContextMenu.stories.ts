import { contextMenu as recipe } from '@flippo-software/component-styles/context-menu';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function item(label: string, name: Parameters<typeof icon>[0], attributes = ''): string {
    return `<demo-context-menu-item ${attributes}>${icon(name)}${label}</demo-context-menu-item>`;
}

function setCard(attributes = ''): string {
    return `<demo-context-menu ${attributes}>
<demo-context-menu-trigger class="sb-card" style="cursor: context-menu">
<span class="sb-caption" style="display: flex; align-items: center; gap: 6px; color: var(--fl-color-set)">${icon('set')}${t('contextMenu.content.32Cards')}</span>
<strong>${t('common.uxLawsExam')}</strong>
<span class="sb-caption">${t('contextMenu.content.rightClickOrLong')}</span>
</demo-context-menu-trigger>
<demo-context-menu-positioner><demo-context-menu-popup>
${item(t('contextMenu.content.open'), 'preview')}${item(t('common.rename'), 'pencil')}${item(t('contextMenu.content.copyTheLink'), 'link')}
<demo-context-menu-separator></demo-context-menu-separator>
${item(t('common.deleteTheSet'), 'delete', 'tone="destructive"')}
</demo-context-menu-popup></demo-context-menu-positioner>
</demo-context-menu>`;
}

const markup = setCard('data-story-target');

const meta: Meta<Props> = {
    title: 'Overlays/ContextMenu',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(`<div class="sb-narrow">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'contextMenu.description' }
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
                t('contextMenu.sections.setCard.title'),
                t('contextMenu.sections.setCard.description'),
                `<div class="sb-narrow">${setCard()}</div>`
            )
        )
};
