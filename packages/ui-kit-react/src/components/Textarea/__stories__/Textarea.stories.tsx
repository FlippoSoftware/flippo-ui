import type * as React from 'react';

import { textarea as recipe } from '@flippo-software/component-styles/textarea';

import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Answer(props: Props & { defaultValue?: string; rows?: number }): React.JSX.Element {
    return (
        <Textarea.Root placeholder={t('textarea.placeholders.typeYourAnswer')} rows={3} {...props}>
            <Textarea.Body>
                <Textarea.Slot aria-label={t('textarea.labels.answer')} />
            </Textarea.Body>
        </Textarea.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Answer {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Textarea',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: { description: { component: 'textarea.description' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('textarea.sections.states.title')} description={t('textarea.sections.states.description')}>
                <Row fill={true} label='blank'>
                    <Answer />
                </Row>
                <Row fill={true} label='filled'>
                    <Answer defaultValue={t('textarea.content.usersPerceiveAnAesthetic')} />
                </Row>
                <Row fill={true} label='disabled'>
                    <Answer disabled={true} defaultValue={t('textarea.content.theCardIsLocked')} />
                </Row>
            </Section>
            <Section title={t('textarea.sections.onACard.title')} description={t('textarea.sections.onACard.description')} raised={true}>
                <Row fill={true} label='inverted'>
                    <Answer appearance='inverted' rows={4} />
                </Row>
            </Section>
        </Page>
    )
};
