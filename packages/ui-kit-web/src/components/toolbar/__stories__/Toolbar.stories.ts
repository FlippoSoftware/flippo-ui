import { toolbar as recipe } from '@flippo-software/component-styles/toolbar';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function toolButton(content: string): string {
    return `<demo-toolbar-button as-child><button type="button">${content}</button></demo-toolbar-button>`;
}

function toggle(value: string, name: 'format-bold' | 'format-italic' | 'format-underline', label: string): string {
    return `<demo-toggle value="${value}" as-child><button type="button" aria-label="${label}">${icon(name)}</button></demo-toggle>`;
}

const separator = '<demo-toolbar-separator></demo-toolbar-separator>';

function editor(attributes = ''): string {
    return `<demo-toolbar ${attributes} aria-label="${t('toolbar.labels.cardFormatting')}">
<demo-toggle-group multiple aria-label="${t('toolbar.labels.style')}">${toggle('bold', 'format-bold', t('common.bold'))}${toggle('italic', 'format-italic', t('common.italic'))}${toggle('underline', 'format-underline', t('common.underlined'))}</demo-toggle-group>
${separator}
<demo-toolbar-group aria-label="${t('toolbar.labels.blocks')}">${toolButton(`${icon('hint')}${t('common.hint')}`)}${toolButton(`${icon('format-list-ul')}${t('common.list')}`)}</demo-toolbar-group>
${separator}
<demo-toolbar-link as-child><a href="#help">${t('common.help')}</a></demo-toolbar-link>
</demo-toolbar>`;
}

const markup = editor('data-story-target');

const meta: Meta<Props> = {
    title: 'Navigation/Toolbar',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'toolbar.descriptionWeb'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const withSearch = () =>
    `<demo-toolbar aria-label="${t('common.set')}">${toolButton(`${icon('plus')}${t('toolbar.content.card')}`)}${toolButton(`${icon('shuffle')}${t('common.shuffle')}`)}${separator}<demo-toolbar-input as-child><input aria-label="${t('toolbar.labels.searchCards')}" placeholder="${t('toolbar.placeholders.searchCards')}"/></demo-toolbar-input></demo-toolbar>`;

export const Gallery: Story = {
    render: () =>
        page(
            section(t('toolbar.sections.cardEditor.title'), t('toolbar.sections.cardEditor.description'), editor()) +
                section(t('toolbar.sections.withSearch.title'), t('toolbar.sections.withSearch.description'), withSearch())
        )
};
