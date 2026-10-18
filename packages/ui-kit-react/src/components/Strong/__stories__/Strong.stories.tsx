import type * as React from 'react';

import { strong as recipe } from '@flippo-software/component-styles/strong';

import type { Meta, StoryObj } from '@storybook/react';

import { Strong, Text } from '~@src';
import { t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Text>
                {t('common.insideAParagraph')} <Strong {...args}>{t('common.aHighlightedFragment')}</Strong> {t('common.andPlainText')}
            </Text>
        </div>
    );
}

const meta = {
    title: 'Typography/Strong',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: { docs: { description: { component: 'strong.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InText: Story = {
    render: () => (
        <div className='story-example sb-medium'>
            <Text>
                {t('strong.content.aDeletedSet')} <Strong>{t('strong.content.cannotBeRestored')}</Strong>.
            </Text>
        </div>
    )
};
