import type * as React from 'react';

import { switchRecipe as recipe } from '@flippo-software/component-styles/switch';

import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from '~@src';
import { Card, Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Setting(props: Props & { label: string; defaultChecked?: boolean }): React.JSX.Element {
    const { label, ...rest } = props;
    return (
        <Switch.Label>
            <Switch.Root {...rest}>
                <Switch.Thumb />
            </Switch.Root>
            {label}
        </Switch.Label>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Setting {...args} label={t('common.notifications')} />
        </div>
    );
}

const meta = {
    title: 'Forms/Switch',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: { docs: { description: { component: 'switch.description' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('switch.sections.statesAndSizes.title')} description={t('switch.sections.statesAndSizes.description')}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Setting size={size} label={t('switch.labels.off')} />
                        <Setting size={size} label={t('switch.labels.on')} defaultChecked={true} />
                        <Setting size={size} label={t('common.disabled')} disabled={true} defaultChecked={true} />
                    </Row>
                ))}
            </Section>
            <Section title={t('switch.sections.setSettings.title')} description={t('switch.sections.setSettings.description')}>
                <Card>
                    <div className='sb-items sb-items--column'>
                        <Setting label={t('common.shuffleTheCards')} defaultChecked={true} />
                        <Setting label={t('common.showHints')} />
                        <Setting label={t('switch.labels.reviewHardOnesMore')} defaultChecked={true} />
                    </div>
                </Card>
            </Section>
        </Page>
    )
};
