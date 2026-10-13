import type * as React from 'react';

import { center as recipe } from '@flippo-software/component-styles/center';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Center, Icon, Text } from '~@src';
import { Page, Resizable, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { height?: string };

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example' style={{ inlineSize: '100%' }}>
            <Resizable>
                <Center {...args} width='100%' className='story-surface'>
                    <Button>По центру</Button>
                </Center>
            </Resizable>
        </div>
    );
}

const meta = {
    title: 'Layout/Center',
    component: Example,
    args: { height: '180px' },
    argTypes: { ...variantControls(recipe), height: { control: 'text' } },
    parameters: { docs: { description: { component: 'Центрирует содержимое по обеим осям.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Пустое состояние' description='Типичный случай: заглушка посреди пустой области.'>
                <Resizable>
                    <Center height='240px' width='100%' className='story-surface'>
                        <div style={{ display: 'grid', justifyItems: 'center', gap: 12, textAlign: 'center' }}>
                            <Icon name='folder' />
                            <Text weight='stronger'>В папке пока нет наборов</Text>
                            <Text size='body-minus' color='tertiary'>
                                Создайте первый набор или перенесите готовый.
                            </Text>
                            <Button size='small'>
                                <Icon name='plus' />
                                Создать набор
                            </Button>
                        </div>
                    </Center>
                </Resizable>
            </Section>
        </Page>
    )
};
