import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Accordion } from '..';

const meta: Meta<typeof Accordion.Root> = {
    title: 'Display/Accordion',
    component: Accordion.Root
};

export default meta;

type AccordionStory = StoryObj<typeof Accordion.Root>;

export const Default: AccordionStory = {
    render: (args) => (
        <Accordion.Root {...args} style={{ width: '500px' }}>
            <Accordion.Item value={'item-1'}>
                <Accordion.Header>
                    <Accordion.Trigger>
                        {'What is React?'}
                        <Accordion.Trigger.Svg />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel>
                    <div>
                        {'React is a JavaScript library for building user interfaces, '}
                        {'particularly web applications. It was developed by Facebook '}
                        {'and is now maintained by Meta and the community.'}
                    </div>
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value={'item-2'}>
                <Accordion.Header>
                    <Accordion.Trigger>
                        {'What are React components?'}
                        <Accordion.Trigger.Svg />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel>
                    <div>
                        {'React components are independent, reusable pieces of UI. '}
                        {'They accept arbitrary inputs (called "props") and return '}
                        {'React elements describing what should appear on the screen.'}
                    </div>
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value={'item-3'}>
                <Accordion.Header>
                    <Accordion.Trigger>
                        {'What is JSX?'}
                        <Accordion.Trigger.Svg />
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel>
                    <div>
                        {'JSX is a syntax extension for JavaScript that looks similar to XML/HTML. '}
                        {'It allows you to write HTML-like code in your JavaScript files, '}
                        {'making it easier to create React components.'}
                    </div>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion.Root>
    )
};
