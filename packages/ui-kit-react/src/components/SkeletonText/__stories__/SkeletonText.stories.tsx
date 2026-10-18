import type * as React from 'react';

import { skeletonText as recipe } from '@flippo-software/component-styles/skeleton-text';

import type { Meta, StoryObj } from '@storybook/react';

import { SkeletonText } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { lines?: number };

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example sb-medium'>
            <SkeletonText {...args} />
        </div>
    );
}

const meta = {
    title: 'Feedback/SkeletonText',
    component: Example,
    args: { lines: 3 },
    argTypes: { ...variantControls(recipe), lines: { control: { type: 'range', min: 1, max: 10, step: 1 } } },
    parameters: {
        docs: {
            description: {
                component: 'skeletonText.description'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const STYLES = () =>
    [
        ['fl-text-heading-3-default', t('common.uxLawsExam')],
        ['fl-text-body-default', t('skeletonText.content.hickSLawThe')],
        ['fl-text-body-minus-default', t('skeletonText.content.createdOnOctober12')]
    ] as const;

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section
                title={t('skeletonText.sections.followsTheFont.title')}
                description={t('skeletonText.sections.followsTheFont.description')}
            >
                {STYLES().map(([className, text]) => (
                    <Row key={className} label={className.replace('fl-text-', '')}>
                        <div
                            className={className}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, inlineSize: '100%', alignItems: 'start' }}
                        >
                            <SkeletonText lines={className.includes('body-default') ? 3 : 1} />
                            <span>{text}</span>
                        </div>
                    </Row>
                ))}
            </Section>
            <Section title={t('skeletonText.sections.animation.title')}>
                {(['pulse', 'shimmer', 'none'] as const).map((animation) => (
                    <Row key={animation} label={animation} fill={true}>
                        <SkeletonText lines={3} animation={animation} />
                    </Row>
                ))}
            </Section>
        </Page>
    )
};
