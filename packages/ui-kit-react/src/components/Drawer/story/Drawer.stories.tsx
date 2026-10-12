import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Drawer } from '..';
import { Button } from '../../Button';

const meta: Meta<typeof Drawer.Root> = {
    title: 'Overlay/Drawer',
    component: Drawer.Root
};

export default meta;

type DrawerStory = StoryObj<typeof Drawer.Root>;

export const Default: DrawerStory = {
    render: (args) => (
        <Drawer.Root {...args}>
            <Drawer.Trigger asChild>
                <Button>
                    {'Open Drawer'}
                </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Popup>
                    <Drawer.Drag />
                    <Drawer.Title>
                        {'Drawer Title'}
                    </Drawer.Title>
                    <Drawer.Description>
                        {'This is a drawer component with drag support. You can drag it to close or use the button below.'}
                    </Drawer.Description>

                    <div style={{ padding: '24px 0' }}>
                        <p>
                            {'Drawer content goes here. You can add any content you want.'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <Drawer.Close asChild>
                            <Button variant={'primary'}>
                                {'Close'}
                            </Button>
                        </Drawer.Close>
                    </div>
                </Drawer.Popup>
            </Drawer.Portal>
        </Drawer.Root>
    )
};

export const FromTop: DrawerStory = {
    render: (args) => (
        <Drawer.Root {...args} direction={'up'}>
            <Drawer.Trigger asChild>
                <Button>
                    {'Open from Top'}
                </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Popup>
                    <Drawer.Drag />
                    <Drawer.Title>
                        {'Top Drawer'}
                    </Drawer.Title>
                    <Drawer.Description>
                        {'This drawer opens from the top of the screen.'}
                    </Drawer.Description>
                    <Drawer.Close asChild>
                        <Button variant={'primary'}>
                            {'Close'}
                        </Button>
                    </Drawer.Close>
                </Drawer.Popup>
            </Drawer.Portal>
        </Drawer.Root>
    )
};

export const FromLeft: DrawerStory = {
    render: (args) => (
        <Drawer.Root {...args} direction={'left'}>
            <Drawer.Trigger asChild>
                <Button>
                    {'Open from Left'}
                </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Popup>
                    <Drawer.Drag style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        width: '100px',
                        height: '100%',
                        right: 0
                    }}
                    />
                    <Drawer.Title>
                        {'Left Drawer'}
                    </Drawer.Title>
                    <Drawer.Description>
                        {'This drawer opens from the left side of the screen.'}
                    </Drawer.Description>
                    <Drawer.Close asChild>
                        <Button variant={'primary'}>
                            {'Close'}
                        </Button>
                    </Drawer.Close>
                </Drawer.Popup>
            </Drawer.Portal>
        </Drawer.Root>
    )
};

export const FromRight: DrawerStory = {
    render: (args) => (
        <Drawer.Root {...args} direction={'right'}>
            <Drawer.Trigger asChild>
                <Button>
                    {'Open from Right'}
                </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Popup>
                    <Drawer.Drag style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        width: '100px',
                        height: '100%',
                        left: 0
                    }}
                    />
                    <Drawer.Title>
                        {'Right Drawer'}
                    </Drawer.Title>
                    <Drawer.Description>
                        {'This drawer opens from the right side of the screen.'}
                    </Drawer.Description>
                    <Drawer.Close asChild>
                        <Button variant={'primary'}>
                            {'Close'}
                        </Button>
                    </Drawer.Close>
                </Drawer.Popup>
            </Drawer.Portal>
        </Drawer.Root>
    )
};

function DrawerWithSnapPoints(args: Drawer.Root.Props) {
    const [activeSnapPoint, setActiveSnapPoint] = React.useState<number>(0);

    return (
        <Drawer.Root
            {...args}
            snapPoints={[100, 300, 500]}
            activeSnapPoint={activeSnapPoint}
            onSnapPointChange={(index) => setActiveSnapPoint(index)}
        >
            <Drawer.Trigger asChild>
                <Button>
                    {'Open with Snap Points'}
                </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Popup>
                    <Drawer.Drag style={{ width: '200px', height: '200px' }} />
                    <Drawer.Title>
                        {'Drawer with Snap Points'}
                    </Drawer.Title>
                    <Drawer.Description>
                        {'Drag to see different snap points: 100px, 300px, 500px, or closed.'}
                    </Drawer.Description>
                    <div style={{ padding: '24px 0' }}>
                        <p>
                            {`Current snap point index: ${activeSnapPoint}`}
                        </p>
                    </div>
                </Drawer.Popup>
            </Drawer.Portal>
        </Drawer.Root>
    );
}

function DrawerWithSnapPointsTop(args: Drawer.Root.Props) {
    const [activeSnapPoint, setActiveSnapPoint] = React.useState<number>(0);

    return (
        <Drawer.Root
          {...args}
          direction={'up'}
          snapPoints={[100, 300, 500]}
          activeSnapPoint={activeSnapPoint}
          onSnapPointChange={(index) => setActiveSnapPoint(index)}
        >
            <Drawer.Trigger asChild>
                <Button>
                    {'Open with Snap Points'}
                </Button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Popup>
                    <Drawer.Title>
                        {'Drawer with Snap Points'}
                    </Drawer.Title>
                    <Drawer.Description>
                        {'Drag to see different snap points: 100px, 300px, 500px, or closed.'}
                    </Drawer.Description>
                    <div style={{ padding: '24px 0' }}>
                        <p>
                            {`Current snap point index: ${activeSnapPoint}`}
                        </p>
                    </div>
                    <Drawer.Drag style={{ width: '200px', height: '200px' }} />
                </Drawer.Popup>
            </Drawer.Portal>
        </Drawer.Root>
    );
}

export const WithSnapPoints: DrawerStory = {
    render: (args) => <DrawerWithSnapPoints {...args} />
};

export const WithSnapPointsTop: DrawerStory = {
    render: (args) => <DrawerWithSnapPointsTop {...args} />
};
