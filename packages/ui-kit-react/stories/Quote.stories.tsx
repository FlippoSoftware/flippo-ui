import type * as React from 'react';

import { quote as recipe } from '@flippo-software/component-styles/quote';

import type { Meta, StoryObj } from '@storybook/react';

import { Quote, Text } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Text>
                Внутри абзаца: <Quote {...args}>выделенный фрагмент</Quote> и обычный текст.
            </Text>
        </div>
    );
}

const meta = {
    title: 'Typography/Quote',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'Короткая цитата внутри текста: кавычки ставит браузер по языку страницы.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InText: Story = {
    render: () => (
        <div className='story-example sb-medium'>
            <Text>
                Миллер писал о <Quote>магическом числе семь плюс-минус два</Quote>.
            </Text>
        </div>
    )
};
