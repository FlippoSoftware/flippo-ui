import * as React from 'react';

import { pinInput as recipe } from '@flippo-software/component-styles/pin-input';

import type { Meta, StoryObj } from '@storybook/react';

import { PinInput } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean; invalid?: boolean; defaultValue?: string; mask?: boolean };

function Code(props: Props & { length?: number }): React.JSX.Element {
    const { length = 4, ...rest } = props;
    const [completed, setCompleted] = React.useState(false);
    return (
        <div className='sb-items sb-items--column' style={{ alignItems: 'flex-start' }}>
            <PinInput.Root {...rest} onValueComplete={() => setCompleted(true)}>
                <PinInput.Group>
                    <PinInput.FocusFunnel>
                        {Array.from({ length }, (_, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: the cells are positions
                            <PinInput.Pin key={index} aria-label={t('pinInput.labels.digit', { number: index + 1 })} />
                        ))}
                    </PinInput.FocusFunnel>
                </PinInput.Group>
            </PinInput.Root>
            <output aria-live='polite' className='sb-caption'>
                {completed ? t('pinInput.content.codeEntered') : t('pinInput.content.enterTheCodeFrom')}
            </output>
        </div>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Code {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/PinInput',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: { component: 'pinInput.description' }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('pinInput.sections.states.title')} description={t('pinInput.sections.states.description')}>
                <Row label='blank'>
                    <Code />
                </Row>
                <Row label='filled'>
                    <Code defaultValue='4271' />
                </Row>
                <Row label='wrong'>
                    <Code defaultValue='4271' invalid={true} />
                </Row>
                <Row label='disabled'>
                    <Code defaultValue='42' disabled={true} />
                </Row>
            </Section>
            <Section title={t('pinInput.sections.sizes.title')} description={t('pinInput.sections.sizes.description')}>
                <Row label='large'>
                    <Code size='large' length={6} />
                </Row>
                <Row label='medium'>
                    <Code size='medium' length={6} />
                </Row>
            </Section>
            <Section title={t('pinInput.sections.onACard.title')} description={t('pinInput.sections.onACard.description')} raised={true}>
                <Row label='inverted'>
                    <Code appearance='inverted' defaultValue='4271' mask={true} />
                </Row>
            </Section>
        </Page>
    )
};
