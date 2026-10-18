import type * as React from 'react';

import { collapsible as recipe } from '@flippo-software/component-styles/collapsible';

import type { Meta, StoryObj } from '@storybook/react';

import { Collapsible, Icon } from '~@src';
import { Card, Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { defaultOpen?: boolean; disabled?: boolean };

function Hint(props: Props): React.JSX.Element {
    return (
        <Collapsible.Root {...props}>
            <Collapsible.Trigger>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Icon name='hint' />

                    {t('common.hint')}
                </span>
                <Collapsible.Icon />
            </Collapsible.Trigger>
            <Collapsible.Panel>
                <Collapsible.Content>{t('collapsible.content.rememberTheHitachiAtm')}</Collapsible.Content>
            </Collapsible.Panel>
        </Collapsible.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Hint {...args} />
        </div>
    );
}

const meta = {
    title: 'Disclosure/Collapsible',
    component: Example,
    args: {},
    argTypes: {
        ...variantControls(recipe),
        defaultOpen: { control: 'boolean', table: { category: 'Behaviour' } },
        disabled: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    parameters: { docs: { description: { component: 'collapsible.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('collapsible.sections.onACard.title')} description={t('collapsible.sections.onACard.description')}>
                <div className='sb-grid' style={{ ['--sb-min' as string]: '280px' }}>
                    <Card>
                        <Hint />
                    </Card>
                    <Card>
                        <Hint defaultOpen={true} />
                    </Card>
                    <Card>
                        <Hint disabled={true} />
                    </Card>
                </div>
            </Section>
        </Page>
    )
};
