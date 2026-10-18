import { menubar as recipe } from '@flippo-software/component-styles/menubar';

import type { Meta, StoryObj } from '@storybook/web-components';

import { menuCheckbox, menuItem, menuPopup, page, renderExample, section, separator, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function menu(label: string, items: string): string {
    return `<demo-menu><demo-menubar-trigger as-child><button type="button">${label}</button></demo-menubar-trigger>${menuPopup(items)}</demo-menu>`;
}

function editorMenus(attributes = ''): string {
    return `<demo-menubar ${attributes} aria-label="${t('menubar.labels.setEditor')}">
${menu(
    t('common.set'),
    menuItem(t('menubar.content.newCard'), { icon: 'plus', end: '⌘N' }) +
        menuItem(t('menubar.content.duplicateTheSet'), { icon: 'copy' }) +
        separator +
        menuItem(t('common.deleteTheSet'), { icon: 'delete', attributes: 'tone="destructive"' })
)}
${menu(t('common.view'), menuCheckbox(t('common.showHints'), 'default-checked') + menuCheckbox(t('menubar.content.compactCards')))}
${menu(t('common.help'), menuItem(t('menubar.content.keyboardShortcuts')) + menuItem(t('menubar.content.whatSNew'), { attributes: 'disabled' }))}
</demo-menubar>`;
}

const markup = editorMenus('data-story-target');

const meta: Meta<Props> = {
    title: 'Navigation/Menubar',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'menubar.description' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => page(section(t('menubar.sections.editorMenu.title'), t('menubar.sections.editorMenu.description'), editorMenus()))
};
