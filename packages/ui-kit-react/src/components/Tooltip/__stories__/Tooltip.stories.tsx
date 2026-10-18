import type * as React from 'react';

import { tooltip as recipe } from '@flippo-software/component-styles/tooltip';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon, Tooltip } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Hint(props: Props & { icon: IconName; text: string; side?: 'top' | 'bottom' | 'left' | 'right' }): React.JSX.Element {
    const { icon, text, side, ...rest } = props;
    return (
        <Tooltip.Root {...rest}>
            <Tooltip.Trigger render={<Button variant='secondary' iconOnly={true} aria-label={text} />}>
                <Icon name={icon} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Positioner side={side}>
                    <Tooltip.Popup>
                        {text}
                        <Tooltip.Arrow />
                    </Tooltip.Popup>
                </Tooltip.Positioner>
            </Tooltip.Portal>
        </Tooltip.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Tooltip.Provider>
                <Hint {...args} icon='shuffle' text={t('tooltip.content.shuffleCards')} />
            </Tooltip.Provider>
        </div>
    );
}

const meta = {
    title: 'Overlays/Tooltip',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'tooltip.description'
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
            <Section title={t('tooltip.sections.actionBar.title')} description={t('tooltip.sections.actionBar.description')}>
                <Tooltip.Provider>
                    <Row label='toolbar'>
                        <Hint icon='shuffle' text={t('common.shuffle')} />
                        <Hint icon='hint' text={t('common.hint')} />
                        <Hint icon='bookmark' text={t('common.markAsDone')} />
                        <Hint icon='delete' text={t('common.delete')} />
                    </Row>
                </Tooltip.Provider>
            </Section>
            <Section title={t('tooltip.sections.sides.title')} description={t('tooltip.sections.sides.description')}>
                <Tooltip.Provider>
                    <Row label='side'>
                        <Hint icon='chevron-up' text={t('common.top')} side='top' />
                        <Hint icon='chevron-down' text={t('common.bottom')} side='bottom' />
                        <Hint icon='chevron-left' text={t('common.left')} side='left' />
                        <Hint icon='chevron-right' text={t('common.right')} side='right' />
                    </Row>
                </Tooltip.Provider>
            </Section>
        </Page>
    )
};
