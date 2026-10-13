import type * as React from 'react';

import { separator as recipe } from '@flippo-software/component-styles/separator';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon, Separator, Text } from '~@src';
import { Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example sb-narrow'>
            <div className='sb-card'>
                <Text weight='stronger'>Аккаунт</Text>
                <Separator {...args} />
                <Text weight='stronger'>Уведомления</Text>
            </div>
        </div>
    );
}

const meta = {
    title: 'Layout/Separator',
    component: Example,
    args: { spacing: 'small' },
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component:
                    'Разделитель (Figma "Divider"): линия толщиной 1px, длина — от контейнера. `spacing` — отступ поперёк линии, `inset` — вдоль (Figma "Padding=12px 6px" это `inset="medium" spacing="small"`).'
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
            <Section title='Горизонтальный' description='Отступы поперёк линии и вдоль неё.'>
                {(['none', 'small', 'medium'] as const).map((inset) => (
                    <Row key={inset} label={`inset ${inset}`} fill={true}>
                        <div className='sb-card' style={{ gap: 0 }}>
                            <Text>Сверху</Text>
                            <Separator inset={inset} spacing='medium' />
                            <Text>Снизу</Text>
                        </div>
                    </Row>
                ))}
            </Section>
            <Section title='Вертикальный' description='`orientation="vertical"` в строке: высота — от строки, `inset` укорачивает линию.'>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Button variant='label' iconOnly={true} aria-label='Жирный'>
                        <Icon name='format-bold' />
                    </Button>
                    <Button variant='label' iconOnly={true} aria-label='Курсив'>
                        <Icon name='format-italic' />
                    </Button>
                    <Separator orientation='vertical' spacing='small' inset='small' />
                    <Button variant='label' iconOnly={true} aria-label='Список'>
                        <Icon name='format-list-ul' />
                    </Button>
                </div>
            </Section>
        </Page>
    )
};
