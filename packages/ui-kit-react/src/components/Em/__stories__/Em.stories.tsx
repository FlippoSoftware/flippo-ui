import type * as React from 'react';

import { em as recipe } from '@flippo-software/component-styles/em';

import type { Meta, StoryObj } from '@storybook/react';

import { Em, Text } from '~@src';
import { t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Text>
                {t('common.insideAParagraph')} <Em {...args}>{t('common.aHighlightedFragment')}</Em> {t('common.andPlainText')}
            </Text>
        </div>
    );
}

const meta = {
    title: 'Typography/Em',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'em.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InText: Story = {
    render: () => (
        <div className='story-example sb-medium'>
            <Text>
                {t('em.content.theCardHasTo')} <Em>{t('em.content.today')}</Em>
                {t('em.content.orTheIntervalIs')}
            </Text>
        </div>
    )
};
