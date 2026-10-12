import * as React from 'react';

import { contextMenu as recipe } from '@flippo-software/component-styles/context-menu';

import type { Meta, StoryObj } from '@storybook/react';

import { ContextMenu, Icon } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

function SetCard(props: Props & { onAction?: (action: string) => void }): React.JSX.Element {
    const { onAction = () => undefined, ...rest } = props;
    return (
        <ContextMenu.Root {...rest}>
            <ContextMenu.Trigger className='sb-card' style={{ cursor: 'context-menu' }}>
                <span className='sb-caption' style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fl-color-set)' }}>
                    <Icon name='set' />
                    32 карточки
                </span>
                <strong>Экзамен Законы UX</strong>
                <span className='sb-caption'>Нажмите правой кнопкой мыши или долго удерживайте</span>
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
                <ContextMenu.Positioner>
                    <ContextMenu.Popup>
                        <ContextMenu.Item onClick={() => onAction('Открыт')}>
                            <Icon name='preview' />
                            Открыть
                        </ContextMenu.Item>
                        <ContextMenu.Item onClick={() => onAction('Переименование')}>
                            <Icon name='pencil' />
                            Переименовать
                        </ContextMenu.Item>
                        <ContextMenu.Item onClick={() => onAction('Ссылка скопирована')}>
                            <Icon name='link' />
                            Скопировать ссылку
                        </ContextMenu.Item>
                        <ContextMenu.Separator />
                        <ContextMenu.Item tone='destructive' onClick={() => onAction('Удалён')}>
                            <Icon name='delete' />
                            Удалить набор
                        </ContextMenu.Item>
                    </ContextMenu.Popup>
                </ContextMenu.Positioner>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    const [action, setAction] = React.useState('');
    return (
        <div className='story-example'>
            <div className='sb-narrow'>
                <SetCard {...args} onAction={setAction} />
            </div>
            <output aria-live='polite' className='sb-caption'>
                {action}
            </output>
        </div>
    );
}

const meta = {
    title: 'Overlays/ContextMenu',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: { description: { component: 'Контекстное меню: открывается у курсора по правой кнопке мыши или долгому касанию.' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Карточка набора' description='Меню действий набора на правой кнопке мыши.'>
                <div className='sb-narrow'>
                    <SetCard />
                </div>
            </Section>
        </Page>
    )
};
