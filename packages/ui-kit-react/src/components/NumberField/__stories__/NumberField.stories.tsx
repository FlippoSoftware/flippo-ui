import type * as React from 'react';

import { numberField as recipe } from '@flippo-software/component-styles/number-field';

import type { Meta, StoryObj } from '@storybook/react';

import { NumberField } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Count(props: Props & { defaultValue?: number }): React.JSX.Element {
    return (
        <NumberField.Root defaultValue={10} min={1} max={50} {...props}>
            <NumberField.Group>
                <NumberField.Decrement aria-label={t('numberField.labels.fewer')} />
                <NumberField.Input aria-label={t('numberField.labels.cardsAtATime')} />
                <NumberField.Increment aria-label={t('numberField.labels.more')} />
            </NumberField.Group>
        </NumberField.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Count {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/NumberField',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'numberField.description'
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
            <Section title={t('numberField.sections.sizes.title')} description={t('numberField.sections.sizes.description')}>
                {(['large', 'medium', 'small'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Count size={size} />
                    </Row>
                ))}
            </Section>
            <Section
                title={t('numberField.sections.lookAndStates.title')}
                description={t('numberField.sections.lookAndStates.description')}
                raised={true}
            >
                <Row label='inverted'>
                    <Count appearance='inverted' />
                </Row>
                <Row label='at min'>
                    <Count appearance='inverted' defaultValue={1} />
                </Row>
                <Row label='disabled'>
                    <Count appearance='inverted' disabled={true} />
                </Row>
            </Section>
        </Page>
    )
};
