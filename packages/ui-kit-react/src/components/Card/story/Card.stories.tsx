import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import * as Button from '../../Button';
import * as Card from '../index.parts';

const meta: Meta<typeof Card.Root> = {
    title: 'Components/Card',
    component: Card.Root,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Card.Root style={{ maxWidth: 400 }}>
            <Card.Content>
                <Card.Title>{'Card Title'}</Card.Title>
                <Card.Description>
                    {'Card automatically connects Title and Description to Root via aria-labelledby and aria-describedby.'}
                </Card.Description>
                <p>{'Main content goes here. You can add any content you want inside the card.'}</p>
            </Card.Content>
            <Card.Footer>
                <Button.Button variant={'primary'}>{'Action'}</Button.Button>
                <Button.Button variant={'secondary'}>{'Cancel'}</Button.Button>
            </Card.Footer>
        </Card.Root>
    )
};

export const WithoutFooter: Story = {
    render: () => (
        <Card.Root style={{ maxWidth: 400 }}>
            <Card.Content>
                <Card.Title>{'Simple Card'}</Card.Title>
                <Card.Description>
                    {'A card without a footer section.'}
                </Card.Description>
                <p>{'This card only has content, no footer actions.'}</p>
            </Card.Content>
        </Card.Root>
    )
};

export const WithLayoutProps: Story = {
    render: () => (
        <Card.Root p={24} m={16} maxWidth={500}>
            <Card.Content>
                <Card.Title>{'Card with Layout Props'}</Card.Title>
                <Card.Description>
                    {'This card uses layout props (padding, margin, maxWidth) directly on the Root component.'}
                </Card.Description>
            </Card.Content>
        </Card.Root>
    )
};

export const MultipleCards: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Card.Root style={{ maxWidth: 300 }}>
                <Card.Content>
                    <Card.Title>{'Card 1'}</Card.Title>
                    <Card.Description>{'First card description'}</Card.Description>
                    <p>{'Content for the first card.'}</p>
                </Card.Content>
            </Card.Root>
            <Card.Root style={{ maxWidth: 300 }}>
                <Card.Content>
                    <Card.Title>{'Card 2'}</Card.Title>
                    <Card.Description>{'Second card description'}</Card.Description>
                    <p>{'Content for the second card.'}</p>
                </Card.Content>
            </Card.Root>
            <Card.Root style={{ maxWidth: 300 }}>
                <Card.Content>
                    <Card.Title>{'Card 3'}</Card.Title>
                    <Card.Description>{'Third card description'}</Card.Description>
                    <p>{'Content for the third card.'}</p>
                </Card.Content>
            </Card.Root>
        </div>
    )
};
