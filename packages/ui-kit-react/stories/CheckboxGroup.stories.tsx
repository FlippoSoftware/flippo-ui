import * as React from 'react';

import { checkboxGroup as recipe } from '@flippo-software/component-styles/checkbox-group';

import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox, CheckboxGroup } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Card, Grid, Page, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const TOPICS = [
    ['design', 'Дизайн'],
    ['psychology', 'Психология'],
    ['research', 'Исследования']
] as const;

function Topics(props: Props & { defaultValue?: string[] }): React.JSX.Element {
    return (
        <CheckboxGroup defaultValue={['design']} aria-label='Темы' {...props}>
            {TOPICS.map(([value, label]) => (
                <Checkbox.Label key={value}>
                    <Checkbox.Root value={value}>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    {label}
                </Checkbox.Label>
            ))}
        </CheckboxGroup>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Topics {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/CheckboxGroup',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: { docs: { description: { component: 'Группа чекбоксов: значение — массив выбранных `value`.' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A parent checkbox that checks all, with the indeterminate state while some are checked. */
function SelectAll(): React.JSX.Element {
    const all = TOPICS.map(([value]) => value);
    const [value, setValue] = React.useState<string[]>(['design']);
    return (
        <CheckboxGroup value={value} onValueChange={setValue} allValues={all} aria-label='Темы'>
            <Checkbox.Label>
                <Checkbox.Root parent={true}>
                    <Checkbox.Indicator />
                </Checkbox.Root>
                Все темы
            </Checkbox.Label>
            <div style={{ display: 'grid', gap: 12, paddingInlineStart: 32 }}>
                {TOPICS.map(([itemValue, label]) => (
                    <Checkbox.Label key={itemValue}>
                        <Checkbox.Root value={itemValue}>
                            <Checkbox.Indicator />
                        </Checkbox.Root>
                        {label}
                    </Checkbox.Label>
                ))}
            </div>
        </CheckboxGroup>
    );
}

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Расположение' description='Колонкой по умолчанию или в строку с переносом.'>
                <Grid min={260}>
                    <Card caption='vertical'>
                        <Topics />
                    </Card>
                    <Card caption='horizontal'>
                        <Topics orientation='horizontal' />
                    </Card>
                    <Card caption='disabled'>
                        <Topics disabled={true} />
                    </Card>
                </Grid>
            </Section>
            <Section
                title='Выбрать все'
                description='Родительский чекбокс отмечает все варианты и показывает «частично», пока выбраны не все.'
            >
                <SelectAll />
            </Section>
        </Page>
    )
};
