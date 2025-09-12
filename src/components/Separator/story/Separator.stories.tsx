import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { StoryCombine } from '../../StoryCombine';
import { Separator } from '../ui/Separator';

import styles from './Decorator.module.scss';

function Decorator(Story: React.ComponentType<Separator.Props>, args?: Separator.Props) {
    return (
        <div className={styles.decorator}>
            <Story {...args} />
        </div>
    );
}

const meta: Meta<typeof Separator> = {
    argTypes: {
        orientation: {
            control: {
                options: ['horizontal', 'vertical'],
                type: 'select'
            }
        },
        spacing: {
            control: {
                options: [
                    4,
                    6,
                    8,
                    10,
                    12
                ],
                type: 'select'
            }
        }
    },
    component: Separator,
    title: 'UIKit/Separator'
};

export default meta;

type SeparatorStory = StoryObj<typeof Separator>;

export const HorizontalSeparator: SeparatorStory = {
    args: {
        orientation: 'horizontal',
        spacing: 6
    },
    decorators: Decorator
};

export const VerticalSeparator: SeparatorStory = {
    args: {
        orientation: 'vertical'
    },
    decorators: Decorator
};

const VARIANTS: StoryCombine.Group<Separator.Props>['variants'] = [
    {
        components: [{}],
        name: 'Default'
    },
    {
        components: [{ spacing: 4 }],
        name: 'Space 4'
    },
    {
        components: [{ spacing: 6 }],
        name: 'Space 6'
    },
    {
        components: [{ spacing: 8 }],
        name: 'Space 8'
    },
    {
        components: [{ spacing: 10 }],
        name: 'Space 10'
    },
    {
        components: [{ spacing: 12 }],
        name: 'Space 12'
    }
];

const GROUPS: StoryCombine.Props<Separator.Props> = {
    component: Separator,
    decorator: Decorator,
    groups: [{
        groupArgs: { orientation: 'horizontal' },
        name: 'Horizontal Separator',
        variants: VARIANTS
    }, {
        groupArgs: { orientation: 'vertical' },
        name: 'Vertical Separator',
        variants: VARIANTS
    }]
};

export const SeparatorCombine: SeparatorStory = {
    argTypes: {
        orientation: {
            control: false
        },
        spacing: {
            control: false
        }
    },
    render: () => <StoryCombine {...GROUPS} />
};
