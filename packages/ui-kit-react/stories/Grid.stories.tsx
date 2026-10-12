import type * as React from 'react';

import { grid as recipe } from '@flippo-software/component-styles/grid';

import type { Meta, StoryObj } from '@storybook/react';

import { Grid } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Resizable, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { columns?: number; spacing?: number };

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example' style={{ inlineSize: '100%' }}>
            <Resizable>
                <Grid.Root {...args} width='100%'>
                    {['1', '2', '3', '4', '5', '6'].map((label) => (
                        <Grid.Item key={label} className='story-surface' p='12px'>
                            {label}
                        </Grid.Item>
                    ))}
                </Grid.Root>
            </Resizable>
        </div>
    );
}

const meta = {
    title: 'Layout/Grid',
    component: Example,
    args: { columns: 3, spacing: 3 },
    argTypes: {
        ...variantControls(recipe),
        columns: { control: { type: 'range', min: 1, max: 6, step: 1 } },
        spacing: { control: { type: 'range', min: 0, max: 8, step: 1 } }
    },
    parameters: {
        docs: {
            description: {
                component:
                    'Сетка: `columns` — число колонок или шаблон, `spacing` — шаг шкалы отступов. `Grid.Item` занимает `colSpan`/`rowSpan` ячеек.'
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
            <Section title='Раскладка страницы' description='Шапка на всю ширину, боковая колонка и содержимое.'>
                <Resizable>
                    <Grid.Root columns={4} spacing={2} width='100%'>
                        <Grid.Item colSpan={4} className='story-surface' p='12px'>
                            Шапка · colSpan 4
                        </Grid.Item>
                        <Grid.Item rowSpan={2} className='story-surface' p='12px'>
                            Папки · rowSpan 2
                        </Grid.Item>
                        <Grid.Item colSpan={3} className='story-surface' p='12px'>
                            Наборы · colSpan 3
                        </Grid.Item>
                        <Grid.Item colSpan={3} className='story-surface' p='12px'>
                            Активность · colSpan 3
                        </Grid.Item>
                    </Grid.Root>
                </Resizable>
            </Section>
            <Section title='Адаптивные колонки' description='Шаблон `repeat(auto-fill, minmax(140px, 1fr))` — сколько поместится.'>
                <Resizable>
                    <Grid.Root columns='repeat(auto-fill, minmax(140px, 1fr))' spacing={2} width='100%'>
                        {Array.from({ length: 7 }, (_, index) => `Набор ${index + 1}`).map((label) => (
                            <Grid.Item key={label} className='story-surface' p='12px'>
                                {label}
                            </Grid.Item>
                        ))}
                    </Grid.Root>
                </Resizable>
            </Section>
        </Page>
    )
};
