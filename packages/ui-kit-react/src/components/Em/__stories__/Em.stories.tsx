import type * as React from 'react';

import { em as recipe } from '@flippo-software/component-styles/em';

import type { Meta, StoryObj } from '@storybook/react';

import { Em, Text } from '~@src';
import { variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Text>
                Внутри абзаца: <Em {...args}>выделенный фрагмент</Em> и обычный текст.
            </Text>
        </div>
    );
}

const meta = {
    title: 'Typography/Em',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'Логическое ударение: курсив.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InText: Story = {
    render: () => (
        <div className='story-example sb-medium'>
            <Text>
                Карточку нужно повторить <Em>сегодня</Em>, иначе интервал собьётся.
            </Text>
        </div>
    )
};
