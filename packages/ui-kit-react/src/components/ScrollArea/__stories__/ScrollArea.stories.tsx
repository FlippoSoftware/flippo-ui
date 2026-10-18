import type * as React from 'react';

import { scrollArea as recipe } from '@flippo-software/component-styles/scroll-area';

import type { Meta, StoryObj } from '@storybook/react';

import { ScrollArea, Text } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

const CARDS = () => [
    t('common.hickSLaw'),
    t('common.fittsSLaw'),
    t('common.millerSLaw'),
    t('common.jakobSLaw'),
    t('common.teslerSLaw'),
    t('scrollArea.content.parkinsonSLaw'),
    t('scrollArea.content.postelSLaw'),
    t('scrollArea.content.zeigarnikEffect'),
    t('scrollArea.content.serialPositionEffect'),
    t('scrollArea.content.aestheticUsabilityEffect'),
    t('scrollArea.content.peakEndRule'),
    t('scrollArea.content.occamSRazor')
];

function Vertical(props: Props): React.JSX.Element {
    return (
        <ScrollArea.Root {...props} style={{ blockSize: 240, inlineSize: 300 }}>
            <ScrollArea.Viewport>
                <ScrollArea.Content>
                    {CARDS().map((card, index) => (
                        <div key={card} style={{ display: 'flex', gap: 12, paddingBlock: 10, paddingInline: 16 }}>
                            <Text color='quaternary' style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {String(index + 1).padStart(2, '0')}
                            </Text>
                            <Text>{card}</Text>
                        </div>
                    ))}
                </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation='vertical'>
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Vertical {...args} />
        </div>
    );
}

const meta = {
    title: 'Layout/ScrollArea',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'scrollArea.description'
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
            <Section title={t('scrollArea.sections.vertical.title')} description={t('scrollArea.sections.vertical.description')}>
                <Row label='vertical'>
                    <Vertical />
                </Row>
            </Section>
            <Section title={t('scrollArea.sections.horizontal.title')} description={t('scrollArea.sections.horizontal.description')}>
                <ScrollArea.Root style={{ inlineSize: '100%', maxInlineSize: 520 }}>
                    <ScrollArea.Viewport>
                        <ScrollArea.Content style={{ display: 'flex', gap: 12, paddingBlockEnd: 14 }}>
                            {CARDS().map((card) => (
                                <div key={card} className='sb-card' style={{ flex: '0 0 160px' }}>
                                    <Text size='body-minus' weight='stronger'>
                                        {card}
                                    </Text>
                                </div>
                            ))}
                        </ScrollArea.Content>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar orientation='horizontal'>
                        <ScrollArea.Thumb />
                    </ScrollArea.Scrollbar>
                </ScrollArea.Root>
            </Section>
        </Page>
    )
};
