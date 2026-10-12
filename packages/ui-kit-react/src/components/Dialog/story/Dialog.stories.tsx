import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Dialog } from '..';
import { Button } from '../../Button';
import { Input } from '../../Input';

const meta: Meta<typeof Dialog.Root> = {
    title: 'Overlay/Dialog',
    component: Dialog.Root
};

export default meta;

type DialogStory = StoryObj<typeof Dialog.Root>;

export const Default: DialogStory = {
    render: (args) => (
        <Dialog.Root {...args}>
            <Dialog.Trigger asChild>
                <Button>
                    {'Open Dialog'}
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                    <Dialog.Title>
                        {'Edit Profile'}
                    </Dialog.Title>
                    <Dialog.Description>
                        {'Make changes to your profile here. Click save when you\'re done.'}
                    </Dialog.Description>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            {'Name'}
                        </label>
                        <Input.Root>
                            <Input.Body>
                                <Input.Slot />
                            </Input.Body>
                        </Input.Root>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            {'Email'}
                        </label>
                        <Input.Root>
                            <Input.Body>
                                <Input.Slot />
                            </Input.Body>
                        </Input.Root>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <Dialog.Close asChild>
                            <Button variant={'secondary'}>
                                {'Cancel'}
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <Button variant={'primary'}>
                                {'Save Changes'}
                            </Button>
                        </Dialog.Close>
                    </div>
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    )
};
