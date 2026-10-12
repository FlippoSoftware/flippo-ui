import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Menu } from '..';
import { Button } from '../../Button';

const meta: Meta<typeof Menu.Root> = {
    title: 'Overlay/Menu',
    component: Menu.Root
};

export default meta;

type MenuStory = StoryObj<typeof Menu.Root>;

export const Default: MenuStory = {
    render: (args) => (
        <Menu.Root {...args}>
            <Menu.Trigger asChild>
                <Button>
                    {'Open Menu'}
                </Button>
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Backdrop />
                <Menu.Positioner>
                    <Menu.Arrow><Menu.Arrow.Svg /></Menu.Arrow>
                    <Menu.Popup>
                        <Menu.Item>
                            {'New File'}
                        </Menu.Item>
                        <Menu.Item>
                            {'Open File'}
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item>
                            {'Save'}
                        </Menu.Item>
                        <Menu.Item variant={'destructive'}>
                            {'Delete'}
                        </Menu.Item>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    ),
    args: {}
};

export const WithGroups: MenuStory = {
    render: (args) => (
        <Menu.Root {...args}>
            <Menu.Trigger asChild>
                <Button>
                    {'File Menu'}
                </Button>
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Backdrop />
                <Menu.Positioner>
                    <Menu.Popup>
                        <Menu.Group>
                            <Menu.GroupLabel>{'File Operations'}</Menu.GroupLabel>
                            <Menu.Item>{'New File'}</Menu.Item>
                            <Menu.Item>{'Open File'}</Menu.Item>
                            <Menu.Item>{'Recent Files'}</Menu.Item>
                        </Menu.Group>

                        <Menu.Separator />

                        <Menu.Group>
                            <Menu.GroupLabel>{'Edit Operations'}</Menu.GroupLabel>
                            <Menu.Item>{'Copy'}</Menu.Item>
                            <Menu.Item>{'Paste'}</Menu.Item>
                            <Menu.Item>{'Cut'}</Menu.Item>
                        </Menu.Group>

                        <Menu.Separator />

                        <Menu.Item variant={'destructive'}>
                            {'Delete Project'}
                        </Menu.Item>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    ),
    args: {}
};

export const WithCheckboxItems: MenuStory = {
    render: (args) => (
        <Menu.Root {...args}>
            <Menu.Trigger asChild>
                <Button>
                    {'View Options'}
                </Button>
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Backdrop />
                <Menu.Positioner>
                    <Menu.Popup>
                        <Menu.Group>
                            <Menu.GroupLabel>{'View Options'}</Menu.GroupLabel>
                            <Menu.CheckboxItem defaultChecked>
                                <Menu.CheckboxItemIndicator>
                                    <Menu.CheckboxItemIndicator.Svg />
                                </Menu.CheckboxItemIndicator>
                                {'Show Sidebar'}
                            </Menu.CheckboxItem>
                            <Menu.CheckboxItem>
                                <Menu.CheckboxItemIndicator>
                                    <Menu.CheckboxItemIndicator.Svg />
                                </Menu.CheckboxItemIndicator>
                                {'Show Toolbar'}
                            </Menu.CheckboxItem>
                            <Menu.CheckboxItem defaultChecked>
                                <Menu.CheckboxItemIndicator>
                                    <Menu.CheckboxItemIndicator.Svg />
                                </Menu.CheckboxItemIndicator>
                                {'Show Status Bar'}
                            </Menu.CheckboxItem>
                        </Menu.Group>

                        <Menu.Separator />

                        <Menu.Item>
                            {'Customize View...'}
                        </Menu.Item>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    ),
    args: {}
};

export const WithRadioItems: MenuStory = {
    render: (args) => {
        return (
            <Menu.Root {...args}>
                <Menu.Trigger asChild>
                    <Button>
                        {'Theme'}
                    </Button>
                </Menu.Trigger>
                <Menu.Portal>
                    <Menu.Backdrop />
                    <Menu.Positioner>
                        <Menu.Popup>
                            <Menu.Group>
                                <Menu.GroupLabel>{'Theme'}</Menu.GroupLabel>
                                <Menu.RadioGroup>
                                    <Menu.RadioItem value={'light'}>
                                        <Menu.RadioItemIndicator><Menu.RadioItemIndicator.Svg /></Menu.RadioItemIndicator>
                                        {'Light Theme'}
                                    </Menu.RadioItem>
                                    <Menu.RadioItem value={'dark'}>
                                        <Menu.RadioItemIndicator><Menu.RadioItemIndicator.Svg /></Menu.RadioItemIndicator>
                                        {'Dark Theme'}
                                    </Menu.RadioItem>
                                    <Menu.RadioItem value={'auto'}>
                                        <Menu.RadioItemIndicator><Menu.RadioItemIndicator.Svg /></Menu.RadioItemIndicator>
                                        {'System Default'}
                                    </Menu.RadioItem>
                                </Menu.RadioGroup>
                            </Menu.Group>

                            <Menu.Separator />

                            <Menu.Item>
                                {'Customize Colors...'}
                            </Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
        );
    },
    args: {}
};

export const WithSubmenu: MenuStory = {
    render: (args) => (
        <Menu.Root {...args}>
            <Menu.Trigger asChild>
                <Button>
                    {'Tools'}
                </Button>
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Backdrop />
                <Menu.Positioner>
                    <Menu.Popup>
                        <Menu.Item>{'Settings'}</Menu.Item>
                        <Menu.Item>{'Preferences'}</Menu.Item>

                        <Menu.Separator />

                        <Menu.SubmenuRoot>
                            <Menu.SubmenuTrigger>
                                {'Import'}
                            </Menu.SubmenuTrigger>
                            <Menu.Portal>
                                <Menu.Positioner>
                                    <Menu.Popup>
                                        <Menu.Item>{'From File'}</Menu.Item>
                                        <Menu.Item>{'From URL'}</Menu.Item>
                                        <Menu.Item>{'From Clipboard'}</Menu.Item>
                                    </Menu.Popup>
                                </Menu.Positioner>
                            </Menu.Portal>
                        </Menu.SubmenuRoot>

                        <Menu.SubmenuRoot>
                            <Menu.SubmenuTrigger>
                                {'Export'}
                            </Menu.SubmenuTrigger>
                            <Menu.Portal>
                                <Menu.Positioner>
                                    <Menu.Popup>
                                        <Menu.Item>{'As PDF'}</Menu.Item>
                                        <Menu.Item>{'As Image'}</Menu.Item>
                                        <Menu.Item>{'As JSON'}</Menu.Item>
                                    </Menu.Popup>
                                </Menu.Positioner>
                            </Menu.Portal>
                        </Menu.SubmenuRoot>

                        <Menu.Separator />

                        <Menu.Item>
                            {'Help'}
                        </Menu.Item>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    ),
    args: {}
};

export const ContextMenu: MenuStory = {
    render: (args) => (
        <div
          style={{
                padding: '40px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#666'
            }}
        >
            <p>{'Right-click in this area to open context menu'}</p>
            <Menu.Root {...args}>
                <Menu.Trigger asChild>
                    <div style={{ minHeight: '100px', cursor: 'context-menu' }}>
                        {'Right-click zone'}
                    </div>
                </Menu.Trigger>
                <Menu.Portal>
                    <Menu.Backdrop />
                    <Menu.Positioner>
                        <Menu.Popup>
                            <Menu.Item>{'Copy'}</Menu.Item>
                            <Menu.Item>{'Paste'}</Menu.Item>
                            <Menu.Item>{'Cut'}</Menu.Item>

                            <Menu.Separator />

                            <Menu.Item>{'Inspect Element'}</Menu.Item>
                            <Menu.Item>{'View Source'}</Menu.Item>

                            <Menu.Separator />

                            <Menu.Item variant={'destructive'}>
                                {'Delete'}
                            </Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
        </div>
    ),
    args: {}
};
