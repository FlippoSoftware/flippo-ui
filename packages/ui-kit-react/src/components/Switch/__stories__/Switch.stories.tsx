import type * as React from 'react';

import { switchRecipe as recipe } from '@flippo-software/component-styles/switch';

import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from '~@src';
import { Card, Page, Row, Section, variantControls } from '~@stories';

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
            <Setting {...args} label='Уведомления' />
        </div>
    );
}

const meta = {
    title: 'Forms/Switch',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: { docs: { description: { component: 'Переключатель настроек: применяет изменение сразу, без кнопки «Сохранить».' } } }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Состояния и размеры' description='32×20, 40×24 и 48×28.'>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Setting size={size} label='Выключен' />
                        <Setting size={size} label='Включён' defaultChecked={true} />
                        <Setting size={size} label='Недоступен' disabled={true} defaultChecked={true} />
                    </Row>
                ))}
            </Section>
            <Section title='Настройки набора' description='Список переключателей на карточке.'>
                <Card>
                    <div className='sb-items sb-items--column'>
                        <Setting label='Перемешивать карточки' defaultChecked={true} />
                        <Setting label='Показывать подсказки' />
                        <Setting label='Повторять сложные чаще' defaultChecked={true} />
                    </div>
                </Card>
            </Section>
        </Page>
    )
};
