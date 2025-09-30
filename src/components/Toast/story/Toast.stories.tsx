import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Toast } from '..';
import { Button } from '../../Button';

const meta: Meta<typeof Toast.Root> = {
    title: 'Feedback/Toast',
    component: Toast.Root
};

export default meta;

type ToastStory = StoryObj<typeof Toast.Root>;

// Basic example - Note: Real usage would involve ToastProvider and manager
export const Default: ToastStory = {
    render: () => (
        <Toast.Provider>
            <ToastButton />
            <Toast.Portal>
                <Toast.Viewport position={'bottom'}>
                    <ToastList />
                </Toast.Viewport>
            </Toast.Portal>
        </Toast.Provider>
    )
};

function ToastButton() {
    const toastManager = Toast.useToastManager();
    const [count, setCount] = React.useState(0);

    function createToast() {
        setCount((prev) => prev + 1);
        toastManager.add({
            title: `Toast ${count + 1} created`,
            description: 'This is a toast notification.'
        });
    }

    return (
        <Button onClick={createToast}>
            {'Create toast'}
        </Button>
    );
}

function ToastList() {
    const { toasts } = Toast.useToastManager();

    return toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}>
            <Toast.Title />
            <Toast.Description />
            <Toast.Close aria-label={'Close'}>
                <Toast.Close.Svg />
            </Toast.Close>
        </Toast.Root>
    ));
}
