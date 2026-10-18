import type * as React from 'react';

import { checkbox as recipe } from '@flippo-software/component-styles/checkbox';

import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Option(props: Props & { label: string; defaultChecked?: boolean; indeterminate?: boolean }): React.JSX.Element {
    const { label, ...rest } = props;
    return (
        <Checkbox.Label size={rest.size}>
            <Checkbox.Root {...rest}>
                <Checkbox.Indicator />
            </Checkbox.Root>
            {label}
        </Checkbox.Label>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Option {...args} label={t('common.shuffleTheCards')} />
        </div>
    );
}

const meta = {
    title: 'Forms/Checkbox',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'checkbox.description'
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
            <Section title={t('checkbox.sections.states.title')} description={t('checkbox.sections.states.description')}>
                <Row label='enabled'>
                    <Option label={t('checkbox.labels.unchecked')} />
                    <Option label={t('checkbox.labels.checked')} defaultChecked={true} />
                    <Option label={t('checkbox.labels.partly')} indeterminate={true} />
                </Row>
                <Row label='disabled'>
                    <Option label={t('checkbox.labels.unchecked')} disabled={true} />
                    <Option label={t('checkbox.labels.checked')} disabled={true} defaultChecked={true} />
                    <Option label={t('checkbox.labels.partly')} disabled={true} indeterminate={true} />
                </Row>
            </Section>
            <Section title={t('checkbox.sections.sizes.title')} description={t('checkbox.sections.sizes.description')}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Option size={size} label={t('checkbox.labels.unchecked')} />
                        <Option size={size} label={t('checkbox.labels.checked')} defaultChecked={true} />
                        <Option size={size} label={t('checkbox.labels.partly')} indeterminate={true} />
                    </Row>
                ))}
            </Section>
        </Page>
    )
};
