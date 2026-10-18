import type * as React from 'react';

import { accordion as recipe } from '@flippo-software/component-styles/accordion';

import type { Meta, StoryObj } from '@storybook/react';

import { Accordion } from '~@src';
import { Card, Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { multiple?: boolean; disabled?: boolean; defaultValue?: string[] };

const LAWS = () =>
    [
        ['aesthetic', t('common.aestheticEffect'), t('accordion.content.usersPerceiveAnAesthetic')],
        ['proximity', t('common.lawOfProximity'), t('accordion.content.elementsCloseToEach')],
        ['jakob', t('common.jakobSLaw'), t('accordion.content.usersSpendMoreTime')],
        ['hick', t('common.hickSLaw'), t('accordion.content.theTimeToDecide')]
    ] as const;

function Laws(props: Props): React.JSX.Element {
    return (
        <Accordion.Root defaultValue={['aesthetic']} {...props}>
            {LAWS().map(([value, title, text]) => (
                <Accordion.Item key={value} value={value}>
                    <Accordion.Header>
                        <Accordion.Trigger>
                            {title}
                            <Accordion.Icon />
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel>
                        <Accordion.Content>{text}</Accordion.Content>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Laws {...args} />
        </div>
    );
}

const meta = {
    title: 'Disclosure/Accordion',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), multiple: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'accordion.description'
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
            <Section title={t('accordion.sections.oneOpenPanel.title')} description={t('accordion.sections.oneOpenPanel.description')}>
                <div className='sb-medium'>
                    <Laws />
                </div>
            </Section>
            <Section title={t('accordion.sections.severalPanels.title')} description={t('accordion.sections.severalPanels.description')}>
                <div className='sb-medium'>
                    <Card>
                        <Laws multiple={true} defaultValue={['aesthetic', 'jakob']} />
                    </Card>
                </div>
            </Section>
        </Page>
    )
};
