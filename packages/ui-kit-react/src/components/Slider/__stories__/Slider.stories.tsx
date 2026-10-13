import type * as React from 'react';

import { slider as recipe } from '@flippo-software/component-styles/slider';

import type { Meta, StoryObj } from '@storybook/react';

import { Slider } from '~@src';
import { Card, Grid, Page, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Daily(props: Props & { defaultValue?: number | number[]; label?: string }): React.JSX.Element {
    const { label = 'Карточек в день', defaultValue = 40, ...rest } = props;
    const range = Array.isArray(defaultValue);
    return (
        <Slider.Root defaultValue={defaultValue} min={0} max={100} {...rest}>
            <div className='sb-items' style={{ justifyContent: 'space-between' }}>
                <span className='sb-caption'>{label}</span>
                <Slider.Value />
            </div>
            <Slider.Control>
                <Slider.Track>
                    <Slider.Indicator />
                    <Slider.Thumb aria-label={range ? 'От' : label} />
                    {range && <Slider.Thumb aria-label='До' />}
                </Slider.Track>
            </Slider.Control>
        </Slider.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Daily {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Slider',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: { description: { component: 'Ползунок: одно значение или диапазон из двух бегунков; стрелки клавиатуры двигают бегунок.' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Значение и диапазон' description='Один бегунок или два для диапазона.'>
                <Grid min={300}>
                    <Card>
                        <Daily />
                    </Card>
                    <Card>
                        <Daily label='Сложность' defaultValue={[20, 70]} />
                    </Card>
                    <Card>
                        <Daily label='Недоступен' disabled={true} />
                    </Card>
                </Grid>
            </Section>
        </Page>
    )
};
