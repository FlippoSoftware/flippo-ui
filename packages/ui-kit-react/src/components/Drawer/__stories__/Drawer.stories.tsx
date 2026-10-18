import type * as React from 'react';

import { drawer as recipe } from '@flippo-software/component-styles/drawer';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Drawer, Icon, Switch } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { direction?: 'down' | 'up' | 'left' | 'right' };

function Settings(props: Props & { label?: string }): React.JSX.Element {
    const { label = t('drawer.content.reviewSettings'), ...rest } = props;
    return (
        <Drawer.Root {...rest}>
            <Drawer.Trigger render={<Button variant='secondary' />}>
                <Icon name='settings' />
                {label}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Viewport>
                    <Drawer.Popup>
                        <Drawer.Drag />
                        <Drawer.Title>{t('drawer.content.reviewSettings')}</Drawer.Title>
                        <Drawer.Description>{t('drawer.content.pullDownOrPress')}</Drawer.Description>
                        <div className='sb-items sb-items--column'>
                            {[t('common.shuffleTheCards'), t('common.showHints'), t('drawer.content.reviewHardOnesMore')].map(
                                (text, index) => (
                                    <Switch.Label key={text}>
                                        <Switch.Root defaultChecked={index !== 1}>
                                            <Switch.Thumb />
                                        </Switch.Root>
                                        {text}
                                    </Switch.Label>
                                )
                            )}
                        </div>
                        <Drawer.Actions>
                            <Drawer.Close render={<Button />}>{t('drawer.content.done')}</Drawer.Close>
                        </Drawer.Actions>
                    </Drawer.Popup>
                </Drawer.Viewport>
            </Drawer.Portal>
        </Drawer.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Settings {...args} />
        </div>
    );
}

const meta = {
    title: 'Overlays/Drawer',
    component: Example,
    args: {},
    argTypes: {
        ...variantControls(recipe),
        direction: { control: 'select', options: ['down', 'up', 'left', 'right'], table: { category: 'Behaviour' } }
    },
    parameters: {
        docs: {
            description: {
                component: 'drawer.description'
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
            <Section title={t('drawer.sections.directions.title')} description={t('drawer.sections.directions.description')}>
                <Row label='down'>
                    <Settings direction='down' label={t('common.bottom')} />
                </Row>
                <Row label='up'>
                    <Settings direction='up' label={t('common.top')} />
                </Row>
                <Row label='right'>
                    <Settings direction='right' label={t('common.right')} />
                </Row>
                <Row label='left'>
                    <Settings direction='left' label={t('common.left')} />
                </Row>
            </Section>
        </Page>
    )
};
