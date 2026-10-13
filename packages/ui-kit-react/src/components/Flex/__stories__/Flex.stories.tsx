import type * as React from 'react';

import { flex as recipe } from '@flippo-software/component-styles/flex';

import type { Meta, StoryObj } from '@storybook/react';

import { Box, Flex } from '~@src';
import { Page, Resizable, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { direction?: 'row' | 'column'; gap?: string };

function Tiles({ count = 3 }: { count?: number }): React.JSX.Element {
    return (
        <>
            {Array.from({ length: count }, (_, index) => String(index + 1)).map((label) => (
                <Box key={label} className='story-surface' p='12px'>
                    {label}
                </Box>
            ))}
        </>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example' style={{ inlineSize: '100%' }}>
            <Resizable>
                <Flex {...args}>
                    <Tiles />
                </Flex>
            </Resizable>
        </div>
    );
}

const meta = {
    title: 'Layout/Flex',
    component: Example,
    args: { direction: 'row', gap: '12px' },
    argTypes: { ...variantControls(recipe), direction: { control: 'select', options: ['row', 'column'] }, gap: { control: 'text' } },
    parameters: { docs: { description: { component: 'Флекс-контейнер: `direction`, `gap`, `align`, `justify`, `wrap` пропсами.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Направление'>
                <Resizable>
                    <Row label='row'>
                        <Flex gap='8px'>
                            <Tiles />
                        </Flex>
                    </Row>
                    <Row label='column'>
                        <Flex direction='column' gap='8px'>
                            <Tiles />
                        </Flex>
                    </Row>
                </Resizable>
            </Section>
            <Section title='Распределение' description='`justify` вдоль оси на всю ширину.'>
                <Resizable>
                    {(['flex-start', 'center', 'space-between', 'flex-end'] as const).map((justify) => (
                        <Row key={justify} label={justify} fill={true}>
                            <Flex justify={justify} gap='8px' width='100%'>
                                <Tiles />
                            </Flex>
                        </Row>
                    ))}
                </Resizable>
            </Section>
            <Section title='Перенос' description='`wrap="wrap"` — элементы переходят на новую строку.'>
                <Resizable>
                    <Flex wrap='wrap' gap='8px' maxWidth='320px'>
                        <Tiles count={9} />
                    </Flex>
                </Resizable>
            </Section>
        </Page>
    )
};
