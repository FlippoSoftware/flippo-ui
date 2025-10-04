import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Select } from '..';

const meta: Meta<typeof Select.Root> = {
    title: 'Input/Select',
    component: Select.Root
};

export default meta;

type SelectStory = StoryObj<typeof Select.Root>;

const fruits = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'pineapple', label: 'Pineapple' }
];

export const Default: SelectStory = {
    render: (args) => (
        <div style={{ width: '200px' }}>
            <Select.Root {...args} defaultValue={'apple'}>
                <Select.Trigger>
                    <Select.Value>
                        {(value) => {
                            if (value) {
                                return value;
                            }

                            return 'Select a fruit...';
                        }}
                    </Select.Value>
                    <Select.Icon>
                        <Select.Icon.Svg />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Positioner side={'bottom'} align={'start'} alignItemWithTrigger={false} sideOffset={8}>
                        <Select.Popup>
                            <Select.Arrow>
                                <Select.Arrow.Svg />
                            </Select.Arrow>
                            <Select.Group>
                                <Select.GroupLabel>{'Fruits'}</Select.GroupLabel>
                                {fruits.map((fruit) => (
                                    <Select.Item key={fruit.value} value={fruit.value}>
                                        <Select.ItemIndicator>
                                            <Select.ItemIndicator.Svg />
                                        </Select.ItemIndicator>
                                        <Select.ItemText>{fruit.label}</Select.ItemText>
                                    </Select.Item>
                                ))}
                            </Select.Group>
                        </Select.Popup>
                    </Select.Positioner>
                </Select.Portal>
            </Select.Root>
        </div>
    )
};

export const LongList: SelectStory = {
    render: (args) => {
        const countries = [
            'Afghanistan',
            'Albania',
            'Algeria',
            'Argentina',
            'Australia',
            'Separator',
            'Austria',
            'Bangladesh',
            'Belgium',
            'Brazil',
            'Canada',
            'Separator',
            'China',
            'Denmark',
            'Egypt',
            'Finland',
            'France',
            'Germany',
            'Greece',
            'Separator',
            'India',
            'Indonesia',
            'Italy',
            'Japan',
            'Mexico',
            'Separator',
            'Netherlands',
            'Norway',
            'Poland',
            'Portugal',
            'Russia',
            'Spain',
            'Separator',
            'Sweden',
            'Switzerland',
            'Turkey',
            'Ukraine',
            'United Kingdom',
            'United States'
        ];

        return (
            <div style={{ width: '250px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    {'Select Country'}
                </label>
                <Select.Root {...args}>
                    <Select.Trigger>
                        <Select.Value>
                            {(value) => {
                                if (value) {
                                    return value;
                                }

                                return 'Choose a country...';
                            }}
                        </Select.Value>
                        <Select.Icon><Select.Icon.Svg /></Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                        <Select.Positioner side={'bottom'} align={'start'} alignItemWithTrigger={false} sideOffset={8}>
                            <Select.ScrollUpArrow />
                            <Select.Popup>
                                {countries.map((country) => (country === 'Separator'
                                    ? <Select.Separator key={country} orientation={'horizontal'} spacing={6} />
                                    : (
                                        <Select.Item key={country} value={country.toLowerCase()}>
                                            <Select.ItemIndicator>
                                                <Select.ItemIndicator.Svg />
                                            </Select.ItemIndicator>
                                            <Select.ItemText>{country}</Select.ItemText>
                                        </Select.Item>
                                    )))}
                            </Select.Popup>
                            <Select.ScrollDownArrow />
                        </Select.Positioner>
                    </Select.Portal>
                </Select.Root>
            </div>
        );
    }
};
