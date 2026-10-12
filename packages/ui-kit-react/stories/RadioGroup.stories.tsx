import type * as React from 'react';

import { radioGroup as recipe } from '@flippo-software/component-styles/radio-group';

import type { Meta, StoryObj } from '@storybook/react';

import { Radio, RadioGroup } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Card, Grid, Page, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const ACCESS = [
    ['private', 'Только я'],
    ['link', 'Все, у кого есть ссылка'],
    ['public', 'Все в сообществе']
] as const;

function Access(props: Props): React.JSX.Element {
    return (
        <RadioGroup defaultValue='link' aria-label='Доступ к набору' {...props}>
            {ACCESS.map(([value, label]) => (
                <Radio.Label key={value}>
                    <Radio.Root value={value}>
                        <Radio.Indicator />
                    </Radio.Root>
                    {label}
                </Radio.Label>
            ))}
        </RadioGroup>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Access {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/RadioGroup',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: { docs: { description: { component: 'Группа радиокнопок: стрелки переключают выбор, значение — `value` выбранной.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Расположение' description='Колонкой или в строку.'>
                <Grid min={300}>
                    <Card caption='vertical'>
                        <Access />
                    </Card>
                    <Card caption='horizontal'>
                        <Access orientation='horizontal' />
                    </Card>
                    <Card caption='disabled'>
                        <Access disabled={true} />
                    </Card>
                </Grid>
            </Section>
        </Page>
    )
};
