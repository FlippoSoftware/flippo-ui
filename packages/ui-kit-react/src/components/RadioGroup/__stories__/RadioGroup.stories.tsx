import type * as React from 'react';

import { radioGroup as recipe } from '@flippo-software/component-styles/radio-group';

import type { Meta, StoryObj } from '@storybook/react';

import { Radio, RadioGroup } from '~@src';
import { Card, Grid, Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const ACCESS = () =>
    [
        ['private', t('radioGroup.content.onlyMe')],
        ['link', t('radioGroup.content.anyoneWithTheLink')],
        ['public', t('radioGroup.content.everyoneInTheCommunity')]
    ] as const;

function Access(props: Props): React.JSX.Element {
    return (
        <RadioGroup defaultValue='link' aria-label={t('radioGroup.labels.accessToTheSet')} {...props}>
            {ACCESS().map(([value, label]) => (
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
    parameters: { docs: { description: { component: 'radioGroup.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('radioGroup.sections.layout.title')} description={t('radioGroup.sections.layout.description')}>
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
