import type * as React from 'react';

import { drawer as recipe } from '@flippo-software/component-styles/drawer';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Drawer, Icon, Switch } from '~@src';
import { Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { direction?: 'down' | 'up' | 'left' | 'right' };

function Settings(props: Props & { label?: string }): React.JSX.Element {
    const { label = 'Настройки повторения', ...rest } = props;
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
                        <Drawer.Title>Настройки повторения</Drawer.Title>
                        <Drawer.Description>Потяните вниз или нажмите Escape, чтобы закрыть.</Drawer.Description>
                        <div className='sb-items sb-items--column'>
                            {['Перемешивать карточки', 'Показывать подсказки', 'Повторять сложные чаще'].map((text, index) => (
                                <Switch.Label key={text}>
                                    <Switch.Root defaultChecked={index !== 1}>
                                        <Switch.Thumb />
                                    </Switch.Root>
                                    {text}
                                </Switch.Label>
                            ))}
                        </div>
                        <Drawer.Actions>
                            <Drawer.Close render={<Button />}>Готово</Drawer.Close>
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
                component: 'Выезжающая панель: снизу на телефоне или сбоку на компьютере; следует за жестом и закрывается свайпом.'
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
            <Section title='Направления' description='С какой стороны выезжает панель и куда её можно смахнуть.'>
                <Row label='down'>
                    <Settings direction='down' label='Снизу' />
                </Row>
                <Row label='up'>
                    <Settings direction='up' label='Сверху' />
                </Row>
                <Row label='right'>
                    <Settings direction='right' label='Справа' />
                </Row>
                <Row label='left'>
                    <Settings direction='left' label='Слева' />
                </Row>
            </Section>
        </Page>
    )
};
