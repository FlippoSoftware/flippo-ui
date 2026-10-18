import type * as React from 'react';

import { marquee as recipe } from '@flippo-software/component-styles/marquee';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Marquee } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { speed?: number; direction?: 'normal' | 'reverse'; pauseOnHover?: boolean };

const TOPICS = (): [IconName, string][] => [
    ['learn', t('common.uxLaws')],
    ['globe', t('common.englishB2')],
    ['set', 'JavaScript'],
    ['star', t('marquee.content.artHistory')],
    ['bookmark', t('marquee.content.anatomy')],
    ['hint', t('common.psychology')]
];

function Chip({ icon, text }: { icon: IconName; text: string }): React.JSX.Element {
    return (
        <span
            className='fl-text-body-minus-default'
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginInlineEnd: 12,
                paddingBlock: 8,
                paddingInline: 14,
                borderRadius: 999,
                background: 'var(--fl-color-bg-2)',
                color: 'var(--fl-color-text-2)',
                whiteSpace: 'nowrap'
            }}
        >
            <Icon name={icon} />
            {text}
        </span>
    );
}

function Ticker(props: Props): React.JSX.Element {
    return (
        <Marquee.Root {...props}>
            <Marquee.Track>
                {TOPICS().map(([icon, text]) => (
                    <Chip key={text} icon={icon} text={text} />
                ))}
            </Marquee.Track>
        </Marquee.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example' style={{ inlineSize: '100%' }}>
            <Ticker {...args} />
        </div>
    );
}

const meta = {
    title: 'Display/Marquee',
    component: Example,
    args: { pauseOnHover: true },
    argTypes: {
        ...variantControls(recipe),
        speed: { control: { type: 'range', min: 10, max: 200, step: 10 }, table: { category: 'Behaviour' } },
        direction: { control: 'inline-radio', options: ['normal', 'reverse'], table: { category: 'Behaviour' } },
        pauseOnHover: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    parameters: {
        docs: { description: { component: 'marquee.description' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('marquee.sections.edges.title')} description={t('marquee.sections.edges.description')}>
                <Row label='plain' fill={true}>
                    <Ticker />
                </Row>
                <Row label='fade' fill={true}>
                    <Ticker fade={true} />
                </Row>
            </Section>
            <Section
                title={t('marquee.sections.directionAndSpeed.title')}
                description={t('marquee.sections.directionAndSpeed.description')}
            >
                <Row label='normal' fill={true}>
                    <Ticker fade={true} direction='normal' speed={40} pauseOnHover={true} />
                </Row>
                <Row label='reverse' fill={true}>
                    <Ticker fade={true} direction='reverse' speed={60} pauseOnHover={true} />
                </Row>
            </Section>
        </Page>
    )
};
