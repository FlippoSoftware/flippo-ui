import type * as React from 'react';

import { segmentedControl as recipe } from '@flippo-software/component-styles/segmented-control';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, SegmentedControl } from '~@src';
import { Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Period(props: Props): React.JSX.Element {
    return (
        <SegmentedControl.Root defaultValue='week' aria-label='Период статистики' {...props}>
            <SegmentedControl.Item value='day'>День</SegmentedControl.Item>
            <SegmentedControl.Item value='week'>Неделя</SegmentedControl.Item>
            <SegmentedControl.Item value='month'>Месяц</SegmentedControl.Item>
            <SegmentedControl.Item value='year' disabled={true}>
                Год
            </SegmentedControl.Item>
        </SegmentedControl.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Period {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/SegmentedControl',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: { docs: { description: { component: 'Переключатель вида: один вариант из нескольких на общей подложке.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Размеры' description='Высота сегмента 28, 32 и 40px.'>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Period size={size} />
                    </Row>
                ))}
            </Section>
            <Section title='С иконками и недоступный' description='Иконка перед подписью; вся группа может быть недоступна.'>
                <Row label='icons'>
                    <SegmentedControl.Root defaultValue='cards' aria-label='Вид'>
                        <SegmentedControl.Item value='list'>
                            <Icon name='format-list-ul' />
                            Список
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value='cards'>
                            <Icon name='set' />
                            Карточки
                        </SegmentedControl.Item>
                    </SegmentedControl.Root>
                </Row>
                <Row label='disabled'>
                    <Period disabled={true} />
                </Row>
            </Section>
        </Page>
    )
};
