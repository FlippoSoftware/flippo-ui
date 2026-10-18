import type * as React from 'react';

import { radio as recipe } from '@flippo-software/component-styles/radio';

import type { Meta, StoryObj } from '@storybook/react';

import { Radio, RadioGroup } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Options(props: Props & { defaultValue?: string }): React.JSX.Element {
    const { defaultValue = 'all', ...rest } = props;
    return (
        <RadioGroup defaultValue={defaultValue} aria-label={t('common.reviewMode')} orientation='horizontal'>
            {[
                ['all', t('common.allCards')],
                ['new', t('radio.content.newOnesOnly')],
                ['hard', t('common.hardOnes')]
            ].map(([value, label]) => (
                <Radio.Label key={value} size={rest.size}>
                    <Radio.Root {...rest} value={value}>
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
            <Options {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Radio',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'radio.description'
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
            <Section title={t('radio.sections.sizes.title')} description={t('radio.sections.sizes.description')}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Options size={size} />
                    </Row>
                ))}
            </Section>
            <Section title={t('radio.sections.disabled.title')} description={t('radio.sections.disabled.description')}>
                <Row label='disabled'>
                    <Options disabled={true} />
                </Row>
            </Section>
        </Page>
    )
};
