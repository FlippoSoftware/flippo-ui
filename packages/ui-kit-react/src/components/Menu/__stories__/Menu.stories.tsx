import * as React from 'react';

import { menu as recipe } from '@flippo-software/component-styles/menu';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon, Menu } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function CardMenu(props: Props & { onAction?: (action: string) => void }): React.JSX.Element {
    const { onAction = () => undefined, ...rest } = props;
    return (
        <Menu.Root {...rest}>
            <Menu.Trigger render={<Button variant='label' iconOnly={true} aria-label={t('menu.labels.cardActions')} />}>
                <Icon name='dots-vertical' />
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Positioner>
                    <Menu.Popup>
                        <Menu.Item onClick={() => onAction(t('menu.content.editing'))}>
                            <Icon name='pencil' />

                            {t('menu.content.edit')}
                            <Menu.ItemEnd>E</Menu.ItemEnd>
                        </Menu.Item>
                        <Menu.Item onClick={() => onAction(t('menu.content.duplicating'))}>
                            <Icon name='copy' />

                            {t('menu.content.duplicate')}
                        </Menu.Item>
                        <Menu.Item onClick={() => onAction(t('menu.content.assignment'))}>
                            <Icon name='person-add' />

                            {t('menu.content.assignToMe')}
                        </Menu.Item>
                        <Menu.Item disabled={true}>
                            <Icon name='bookmark' />
                            {t('menu.content.moveToDone')}
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item tone='destructive' onClick={() => onAction(t('menu.content.deleting'))}>
                            <Icon name='delete' />

                            {t('common.delete')}
                        </Menu.Item>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    const [action, setAction] = React.useState('');
    return (
        <div className='story-example'>
            <CardMenu {...args} onAction={setAction} />
            <output aria-live='polite' className='sb-caption'>
                {action}
            </output>
        </div>
    );
}

const meta = {
    title: 'Overlays/Menu',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'menu.description'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function ViewMenu(): React.JSX.Element {
    const [sort, setSort] = React.useState('recent');
    return (
        <Menu.Root>
            <Menu.Trigger render={<Button variant='secondary' />}>
                {t('common.view')}
                <Icon name='chevron-down' />
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Positioner>
                    <Menu.Popup>
                        <Menu.Group>
                            <Menu.GroupLabel>{t('menu.content.show')}</Menu.GroupLabel>
                            <Menu.CheckboxItem defaultChecked={true}>
                                {t('common.hints')}
                                <Menu.CheckboxItemIndicator />
                            </Menu.CheckboxItem>
                            <Menu.CheckboxItem>
                                {t('menu.content.emptyCards')}
                                <Menu.CheckboxItemIndicator />
                            </Menu.CheckboxItem>
                        </Menu.Group>
                        <Menu.Separator />
                        <Menu.Group>
                            <Menu.GroupLabel>{t('menu.content.sort')}</Menu.GroupLabel>
                            <Menu.RadioGroup value={sort} onValueChange={setSort}>
                                <Menu.RadioItem value='recent'>
                                    {t('menu.content.recent')}
                                    <Menu.RadioItemIndicator />
                                </Menu.RadioItem>
                                <Menu.RadioItem value='alpha'>
                                    {t('menu.content.alphabetical')}
                                    <Menu.RadioItemIndicator />
                                </Menu.RadioItem>
                            </Menu.RadioGroup>
                        </Menu.Group>
                        <Menu.Separator />
                        <Menu.SubmenuRoot>
                            <Menu.SubmenuTrigger>
                                <Icon name='folder' />

                                {t('menu.content.moveToAFolder')}
                                <Menu.ItemEnd>
                                    <Icon name='chevron-right' />
                                </Menu.ItemEnd>
                            </Menu.SubmenuTrigger>
                            <Menu.Portal>
                                <Menu.Positioner>
                                    <Menu.Popup>
                                        <Menu.Item>{t('common.selfImprovement')}</Menu.Item>
                                        <Menu.Item>{t('common.term2')}</Menu.Item>
                                    </Menu.Popup>
                                </Menu.Positioner>
                            </Menu.Portal>
                        </Menu.SubmenuRoot>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
}

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('menu.sections.actions.title')} description={t('menu.sections.actions.description')}>
                <Row label='card menu'>
                    <CardMenu />
                </Row>
            </Section>
            <Section
                title={t('menu.sections.checkboxesChoiceAndA.title')}
                description={t('menu.sections.checkboxesChoiceAndA.description')}
            >
                <Row label='view'>
                    <ViewMenu />
                </Row>
            </Section>
        </Page>
    )
};
