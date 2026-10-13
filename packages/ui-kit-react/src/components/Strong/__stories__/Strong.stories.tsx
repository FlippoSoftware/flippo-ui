import type * as React from 'react';

import { strong as recipe } from '@flippo-software/component-styles/strong';

import type { Meta, StoryObj } from '@storybook/react';

import { Strong, Text } from '~@src';
import { variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Text>
                Внутри абзаца: <Strong {...args}>выделенный фрагмент</Strong> и обычный текст.
            </Text>
        </div>
    );
}

const meta = {
    title: 'Typography/Strong',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'Важное в тексте: насыщенное начертание.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InText: Story = {
    render: () => (
        <div className='story-example sb-medium'>
            <Text>
                Удалённый набор <Strong>нельзя восстановить</Strong>.
            </Text>
        </div>
    )
};
