import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '../';
import { StoryCombine } from '../../StoryCombine';

const meta: Meta<typeof Input.Root> = {
    argTypes: {
        children: { control: 'object', name: 'React.ReactNode' },
        disabled: { control: 'boolean' },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large']
        },
        variant: {
            control: 'select',
            options: ['inverted', 'underline']
        }
    },
    component: Input.Root,
    title: 'UIKit/Input'
};

export default meta;

type InputStory = StoryObj<typeof Input>;

export const InputInverted: InputStory = {
    args: {},
    render: () => (
        <Input.Root placeholder={'Placeholder'}>
            <Input.Body>
                <Input.Slot />
            </Input.Body>
        </Input.Root>
    )
};

export const InputInvertedWithClear: InputStory = {
    args: {},
    render: () => (
        <Input.Root placeholder={'Placeholder'}>
            <Input.Body>
                <Input.Slot />
                <Input.Clear />
            </Input.Body>
        </Input.Root>
    )
};

export const InputUnderline: InputStory = {
    args: {},
    render: () => (
        <Input.Root>
            <Input.Body variant={'underline'}>
                <Input.Slot />
            </Input.Body>
        </Input.Root>
    )
};

const INVERTED_VARIANTS: StoryCombine.Group<Input.Root.Props>['variants'] = [{
    components: [{
        children: (
            <Input.Body dimensions={'large'}>
                <Input.Slot />
                <Input.Clear />
            </Input.Body>
        )
    }],
    name: 'Large'
}, {
    variantArgs: {
    },
    components: [{
        children: (
            <Input.Body dimensions={'medium'}>
                <Input.Slot />
                <Input.Clear />
            </Input.Body>
        )
    }],
    name: 'Medium'
}, {

    components: [{
        children: (
            <Input.Body dimensions={'small'}>
                <Input.Slot />
                <Input.Clear />
            </Input.Body>
        )
    }],
    name: 'Small'
}];

const GROUPS: StoryCombine.Props<Input.Root.Props> = {
    component: Input.Root,
    groups: [{
        groupArgs: {
            variant: 'inverted'
        },
        name: 'Inverted',
        variants: INVERTED_VARIANTS
    }, {
        groupArgs: {
            variant: 'underline'
        },
        name: 'Underline',
        variants: [{
            name: 'Invisible',
            components: [{
                children: (
                    <React.Fragment>
                        <Input.Slot />
                    </React.Fragment>
                )
            }]
        }, {
            variantArgs: {
                view: 'affordance'
            },
            name: 'Affordance',
            components: [{
                children: (
                    <React.Fragment>
                        <Input.Slot />
                    </React.Fragment>
                )
            }]
        }]
    }]
};

export const InputStoryCombine: InputStory = {
    render: () => <StoryCombine {...GROUPS} />
};
