import type * as React from 'react';

import { center as recipe } from '@flippo-software/component-styles/center';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Center, Icon, Text } from '~@src';
import { Page, Resizable, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { height?: string };

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example' style={{ inlineSize: '100%' }}>
            <Resizable>
                <Center {...args} width='100%' className='story-surface'>
                    <Button>{t('center.content.centred')}</Button>
                </Center>
            </Resizable>
        </div>
    );
}

const meta = {
    title: 'Layout/Center',
    component: Example,
    args: { height: '180px' },
    argTypes: { ...variantControls(recipe), height: { control: 'text' } },
    parameters: { docs: { description: { component: 'center.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('center.sections.emptyState.title')} description={t('center.sections.emptyState.description')}>
                <Resizable>
                    <Center height='240px' width='100%' className='story-surface'>
                        <div style={{ display: 'grid', justifyItems: 'center', gap: 12, textAlign: 'center' }}>
                            <Icon name='folder' />
                            <Text weight='stronger'>{t('center.content.thereAreNoSets')}</Text>
                            <Text size='body-minus' color='tertiary'>
                                {t('center.content.createYourFirstSet')}
                            </Text>
                            <Button size='small'>
                                <Icon name='plus' />

                                {t('common.createASet')}
                            </Button>
                        </div>
                    </Center>
                </Resizable>
            </Section>
        </Page>
    )
};
