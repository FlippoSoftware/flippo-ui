import type * as React from 'react';

import { meter as recipe } from '@flippo-software/component-styles/meter';

import type { Meta, StoryObj } from '@storybook/react';

import { Meter } from '~@src';
import { Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { value?: number; label?: string; max?: number };

function Gauge(props: Props): React.JSX.Element {
    const { value = 72, label = 'Выучено карточек', max = 100, ...rest } = props;
    return (
        <Meter.Root {...rest} value={value} min={0} max={max}>
            <Meter.Label>{label}</Meter.Label>
            <Meter.Value />
            <Meter.Track>
                <Meter.Indicator />
            </Meter.Track>
        </Meter.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example sb-medium'>
            <Gauge {...args} />
        </div>
    );
}

const meta = {
    title: 'Feedback/Meter',
    component: Example,
    args: { value: 72 },
    argTypes: { ...variantControls(recipe), value: { control: { type: 'range', min: 0, max: 100, step: 1 } } },
    parameters: {
        docs: {
            description: {
                component:
                    'Измеритель: доля от известного диапазона (заполненность, прогресс обучения). Выглядит как Progress, но это не ход задачи.'
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
            <Section title='Значения' description='Пусто, частично и полностью.'>
                <Row label='0%' fill={true}>
                    <Gauge value={0} />
                </Row>
                <Row label='72%' fill={true}>
                    <Gauge value={72} />
                </Row>
                <Row label='100%' fill={true}>
                    <Gauge value={100} label='Набор выучен' />
                </Row>
            </Section>
            <Section title='Размеры' description='Medium и large.'>
                <Row label='medium' fill={true}>
                    <Gauge value={48} label='Хранилище' size='medium' />
                </Row>
                <Row label='large' fill={true}>
                    <Gauge value={48} label='Хранилище' size='large' />
                </Row>
            </Section>
        </Page>
    )
};
