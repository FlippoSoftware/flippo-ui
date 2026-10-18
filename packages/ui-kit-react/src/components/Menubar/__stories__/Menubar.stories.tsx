import type * as React from 'react';

import { menubar as recipe } from '@flippo-software/component-styles/menubar';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Menu, Menubar } from '~@src';
import { Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function EditorMenus(props: Props): React.JSX.Element {
    return (
        <Menubar {...props} aria-label={t('menubar.labels.setEditor')}>
            <Menu.Root>
                <Menubar.Trigger>{t('common.set')}</Menubar.Trigger>
                <Menu.Portal>
                    <Menu.Positioner>
                        <Menu.Popup>
                            <Menu.Item>
                                <Icon name='plus' />

                                {t('menubar.content.newCard')}
                                <Menu.ItemEnd>⌘N</Menu.ItemEnd>
                            </Menu.Item>
                            <Menu.Item>
                                <Icon name='copy' />

                                {t('menubar.content.duplicateTheSet')}
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item tone='destructive'>
                                <Icon name='delete' />

                                {t('common.deleteTheSet')}
                            </Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
            <Menu.Root>
                <Menubar.Trigger>{t('common.view')}</Menubar.Trigger>
                <Menu.Portal>
                    <Menu.Positioner>
                        <Menu.Popup>
                            <Menu.CheckboxItem defaultChecked={true}>
                                {t('common.showHints')}
                                <Menu.CheckboxItemIndicator />
                            </Menu.CheckboxItem>
                            <Menu.CheckboxItem>
                                {t('menubar.content.compactCards')}
                                <Menu.CheckboxItemIndicator />
                            </Menu.CheckboxItem>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
            <Menu.Root>
                <Menubar.Trigger>{t('common.help')}</Menubar.Trigger>
                <Menu.Portal>
                    <Menu.Positioner>
                        <Menu.Popup>
                            <Menu.Item>{t('menubar.content.keyboardShortcuts')}</Menu.Item>
                            <Menu.Item disabled={true}>{t('menubar.content.whatSNew')}</Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
        </Menubar>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <EditorMenus {...args} />
        </div>
    );
}

const meta = {
    title: 'Navigation/Menubar',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: { description: { component: 'menubar.description' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('menubar.sections.editorMenu.title')} description={t('menubar.sections.editorMenu.description')}>
                <EditorMenus />
            </Section>
        </Page>
    )
};
