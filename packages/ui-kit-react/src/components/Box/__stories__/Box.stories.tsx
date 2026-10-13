import type * as React from 'react';

import { box as recipe } from '@flippo-software/component-styles/box';

import type { Meta, StoryObj } from '@storybook/react';

import { Box, Text } from '~@src';
import { Page, Resizable, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { p?: string; width?: string };

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example' style={{ inlineSize: '100%' }}>
            <Resizable>
                <Box {...args} className='story-surface'>
                    Блок с отступами и размерами из пропсов.
                </Box>
            </Resizable>
        </div>
    );
}

const meta = {
    title: 'Layout/Box',
    component: Example,
    args: { p: '24px', width: '100%' },
    argTypes: { ...variantControls(recipe), p: { control: 'text' }, width: { control: 'text' } },
    parameters: {
        docs: {
            description: {
                component: 'Базовый блок раскладки: отступы (`p`, `px`, `m`…), размеры (`width`, `maxWidth`…), позиция и overflow пропсами.'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Отступы'>
                <Resizable>
                    {['8px', '16px', '32px'].map((p) => (
                        <Row key={p} label={`p ${p}`}>
                            <Box p={p} className='story-surface'>
                                <Text size='body-minus'>Содержимое</Text>
                            </Box>
                        </Row>
                    ))}
                </Resizable>
            </Section>
            <Section title='Размеры' description='`maxWidth` ограничивает ширину, `width="100%"` растягивает.'>
                <Resizable>
                    <Row label='maxWidth 240' fill={true}>
                        <Box p='12px' maxWidth='240px' className='story-surface'>
                            Не шире 240px, даже если места больше
                        </Box>
                    </Row>
                </Resizable>
            </Section>
        </Page>
    )
};
