import type * as React from 'react';

import { skeleton as recipe } from '@flippo-software/component-styles/skeleton';

import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton, SkeletonText } from '~@src';
import { Grid, Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { width?: string; height?: string };

function Example(args: Props): React.JSX.Element {
    const { width = '240px', height = '80px', ...rest } = args;
    return (
        <div className='story-example'>
            <Skeleton {...rest} style={{ width, height }} />
        </div>
    );
}

/** A set card while it loads: the same paddings as the real card, blocks in place of the content. */
function SetCardSkeleton(props: Props): React.JSX.Element {
    return (
        <div className='sb-card' aria-busy={true}>
            <Skeleton {...props} style={{ width: 96, height: 14 }} />
            <SkeletonText lines={2} animation={props.animation} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBlockStart: 4 }}>
                <Skeleton {...props} circle={true} style={{ width: 24, height: 24 }} />
                <Skeleton {...props} style={{ width: 120, height: 12 }} />
            </div>
        </div>
    );
}

const meta = {
    title: 'Feedback/Skeleton',
    component: Example,
    args: { width: '240px', height: '80px' },
    argTypes: { ...variantControls(recipe), width: { control: 'text' }, height: { control: 'text' } },
    parameters: {
        docs: {
            description: {
                component: 'Заглушка на время загрузки: прямоугольник или круг нужного размера; анимации pulse, shimmer или без неё.'
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
            <Section title='Анимация' description='Pulse мерцает целиком, shimmer пробегает бликом, none — статичная заливка.'>
                {(['pulse', 'shimmer', 'none'] as const).map((animation) => (
                    <Row key={animation} label={animation}>
                        <Skeleton animation={animation} circle={true} style={{ width: 40, height: 40 }} />
                        <Skeleton animation={animation} style={{ width: 200, height: 40 }} />
                    </Row>
                ))}
            </Section>
            <Section title='Карточки при загрузке' description='Сетка наборов, пока данные не пришли.'>
                <Grid min={220}>
                    <SetCardSkeleton />
                    <SetCardSkeleton animation='shimmer' />
                    <SetCardSkeleton />
                </Grid>
            </Section>
        </Page>
    )
};
