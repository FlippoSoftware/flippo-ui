import type * as React from 'react';

import { quote as recipe } from '@flippo-software/component-styles/quote';

import type { Meta, StoryObj } from '@storybook/react';

import { Quote, Text } from '~@src';
import { t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Text>
                {t('common.insideAParagraph')} <Quote {...args}>{t('common.aHighlightedFragment')}</Quote> {t('common.andPlainText')}
            </Text>
        </div>
    );
}

const meta = {
    title: 'Typography/Quote',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'quote.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InText: Story = {
    render: () => (
        <div className='story-example sb-medium'>
            <Text>
                {t('quote.content.millerWroteAbout')} <Quote>{t('quote.content.theMagicalNumberSeven')}</Quote>.
            </Text>
        </div>
    )
};
