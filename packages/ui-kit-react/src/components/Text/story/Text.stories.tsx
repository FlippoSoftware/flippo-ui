import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import * as Box from '../../Box';
import { Text } from '../ui/Text';

const meta: Meta<typeof Text> = {
    title: 'Components/Text',
    component: Text,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: [
                'display-1',
                'display-2',
                'title-1',
                'title-2',
                'title-3',
                'heading-1',
                'heading-2',
                'heading-3',
                'body-plus',
                'body',
                'body-minus',
                'label'
            ]
        },
        weight: {
            control: 'select',
            options: ['weaker', 'default', 'stronger']
        },
        color: {
            control: 'select',
            options: [
                'primary',
                'secondary',
                'tertiary',
                'quaternary',
                'white',
                'disabled',
                'brand',
                'success',
                'error',
                'warning'
            ]
        }
    }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'The quick brown fox jumps over the lazy dog'
    }
};

export const Sizes: Story = {
    render: () => (
        <Box.Box p={24}>
            <Text size={'display-1'} mb={16}>{'Display 1'}</Text>
            <Text size={'display-2'} mb={16}>{'Display 2'}</Text>
            <Text size={'title-1'} mb={16}>{'Title 1'}</Text>
            <Text size={'title-2'} mb={16}>{'Title 2'}</Text>
            <Text size={'title-3'} mb={16}>{'Title 3'}</Text>
            <Text size={'heading-1'} mb={16}>{'Heading 1'}</Text>
            <Text size={'heading-2'} mb={16}>{'Heading 2'}</Text>
            <Text size={'heading-3'} mb={16}>{'Heading 3'}</Text>
            <Text size={'body-plus'} mb={16}>{'Body Plus'}</Text>
            <Text size={'body'} mb={16}>{'Body'}</Text>
            <Text size={'body-minus'} mb={16}>{'Body Minus'}</Text>
            <Text size={'label'}>{'Label'}</Text>
        </Box.Box>
    )
};

export const Weights: Story = {
    render: () => (
        <Box.Box p={24}>
            <Text size={'heading-1'} weight={'weaker'} mb={8}>{'Heading Weaker'}</Text>
            <Text size={'heading-1'} weight={'default'} mb={8}>{'Heading Default'}</Text>
            <Text size={'heading-1'} weight={'stronger'} mb={8}>{'Heading Stronger'}</Text>
        </Box.Box>
    )
};

export const Colors: Story = {
    render: () => (
        <Box.Box p={24}>
            <Text color={'primary'} mb={8}>{'Primary color'}</Text>
            <Text color={'secondary'} mb={8}>{'Secondary color'}</Text>
            <Text color={'tertiary'} mb={8}>{'Tertiary color'}</Text>
            <Text color={'quaternary'} mb={8}>{'Quaternary color'}</Text>
            <Text color={'brand'} mb={8}>{'Brand color'}</Text>
            <Text color={'success'} mb={8}>{'Success color'}</Text>
            <Text color={'error'} mb={8}>{'Error color'}</Text>
            <Text color={'warning'} mb={8}>{'Warning color'}</Text>
        </Box.Box>
    )
};

export const Alignment: Story = {
    render: () => (
        <Box.Box p={24} width={400}>
            <Text align={'left'} mb={8}>{'Left aligned text'}</Text>
            <Text align={'center'} mb={8}>{'Center aligned text'}</Text>
            <Text align={'right'} mb={8}>{'Right aligned text'}</Text>
            <Text align={'justify'}>{'Justified text with longer content to show how justify alignment works with multiple lines of text.'}</Text>
        </Box.Box>
    )
};

export const Transform: Story = {
    render: () => (
        <Box.Box p={24}>
            <Text transform={'none'} mb={8}>{'Normal text'}</Text>
            <Text transform={'uppercase'} mb={8}>{'Uppercase text'}</Text>
            <Text transform={'lowercase'} mb={8}>{'LOWERCASE TEXT'}</Text>
            <Text transform={'capitalize'}>{'capitalized text'}</Text>
        </Box.Box>
    )
};

export const Truncate: Story = {
    render: () => (
        <Box.Box p={24} width={300}>
            <Text truncate>
                {'This is a very long text that will be truncated with an ellipsis when it exceeds the container width'}
            </Text>
        </Box.Box>
    )
};

export const WithMargins: Story = {
    render: () => (
        <Box.Box p={24}>
            <Text size={'heading-1'} mb={16}>{'Title with bottom margin'}</Text>
            <Text size={'body'} mt={8} mb={8}>{'Body text with vertical margins'}</Text>
            <Text size={'body-minus'} color={'tertiary'}>{'Small text without margins'}</Text>
        </Box.Box>
    )
};

export const Polymorphic: Story = {
    render: () => (
        <Box.Box p={24}>
            <Text as={'h1'} size={'display-1'} mb={16}>{'H1 Element'}</Text>
            <Text as={'h2'} size={'title-1'} mb={12}>{'H2 Element'}</Text>
            <Text as={'p'} size={'body'} mb={8}>{'Paragraph element'}</Text>
            <Text as={'label'} size={'label'} color={'tertiary'}>{'Label element'}</Text>
        </Box.Box>
    )
};
