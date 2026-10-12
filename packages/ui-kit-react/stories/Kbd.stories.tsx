import type * as React from 'react';

import { kbd as recipe } from '@flippo-software/component-styles/kbd';

import type { Meta, StoryObj } from '@storybook/react';

import { Kbd, Text } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Kbd {...args}>⌘ K</Kbd>
        </div>
    );
}

const meta = {
    title: 'Typography/Kbd',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'Клавиша или сочетание клавиш в подсказках и меню.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Варианты'>
                {(['outline', 'soft', 'ghost'] as const).map((variant) => (
                    <Row key={variant} label={variant}>
                        <Kbd variant={variant}>Space</Kbd>
                        <Kbd variant={variant}>←</Kbd>
                        <Kbd variant={variant}>→</Kbd>
                    </Row>
                ))}
            </Section>
            <Section title='Размеры'>
                <Row label='size'>
                    {(['1', '2', '3', '4', '5'] as const).map((size) => (
                        <Kbd key={size} size={size}>
                            Esc
                        </Kbd>
                    ))}
                </Row>
            </Section>
            <Section title='Подсказка к повторению'>
                <Text color='tertiary'>
                    <Kbd>Space</Kbd> — перевернуть карточку, <Kbd>←</Kbd> — не помню, <Kbd>→</Kbd> — помню.
                </Text>
            </Section>
        </Page>
    )
};
