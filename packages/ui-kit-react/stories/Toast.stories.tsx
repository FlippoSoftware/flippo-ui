import type * as React from 'react';

import { toast as recipe } from '@flippo-software/component-styles/toast';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon, Spinner, Toast } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

const TYPE_ICONS: Record<string, IconName> = {
    success: 'circle-check-fill',
    warning: 'circle-info-fill',
    error: 'circle-xmark-fill',
    like: 'favorite-fill',
    info: 'circle-info-fill'
};

function ToastList(args: Props): React.JSX.Element {
    const { toasts } = Toast.useToastManager();
    return (
        <>
            {toasts.map((toast) => (
                <Toast.Root {...args} key={toast.id} toast={toast}>
                    <Toast.Icon>
                        {toast.type === 'loading' ? (
                            <Spinner size='x-small' color='current' aria-hidden={true} />
                        ) : (
                            <Icon name={TYPE_ICONS[toast.type ?? 'info'] ?? 'circle-info-fill'} />
                        )}
                    </Toast.Icon>
                    <Toast.Content>
                        <Toast.Title />
                        <Toast.Description />
                    </Toast.Content>
                    {toast.actionProps && <Toast.Action {...toast.actionProps} />}
                    <Toast.Close aria-label='Закрыть уведомление' />
                </Toast.Root>
            ))}
        </>
    );
}

function Stage({ args = {}, children }: { args?: Props; children: React.ReactNode }): React.JSX.Element {
    return (
        <Toast.Provider>
            {children}
            <Toast.Portal>
                <Toast.Viewport>
                    <ToastList {...args} />
                </Toast.Viewport>
            </Toast.Portal>
        </Toast.Provider>
    );
}

function Triggers(): React.JSX.Element {
    const manager = Toast.useToastManager();
    return (
        <>
            <Row label='types'>
                <Button variant='secondary' onClick={() => manager.add({ type: 'success', title: 'Набор сохранён' })}>
                    Успех
                </Button>
                <Button variant='secondary' onClick={() => manager.add({ type: 'info', title: 'Ссылка скопирована' })}>
                    Инфо
                </Button>
                <Button
                    variant='secondary'
                    onClick={() => manager.add({ type: 'warning', title: 'Нет сети', description: 'Изменения сохранятся позже.' })}
                >
                    Предупреждение
                </Button>
                <Button
                    variant='secondary'
                    onClick={() => manager.add({ type: 'error', title: 'Не удалось удалить', description: 'Попробуйте ещё раз.' })}
                >
                    Ошибка
                </Button>
                <Button variant='secondary' onClick={() => manager.add({ type: 'like', title: 'Добавлено в избранное' })}>
                    Лайк
                </Button>
            </Row>
            <Row label='action'>
                <Button
                    variant='danger'
                    onClick={() => {
                        const id = manager.add({
                            title: 'Карточка удалена',
                            actionProps: { children: 'Отменить', onClick: () => manager.close(id) }
                        });
                    }}
                >
                    <Icon name='delete' />
                    Удалить с отменой
                </Button>
            </Row>
            <Row label='promise'>
                <Button
                    onClick={() =>
                        manager.promise(new Promise((resolve) => setTimeout(resolve, 1600)), {
                            loading: { title: 'Публикуем набор…' },
                            success: { title: 'Набор опубликован' },
                            error: { title: 'Ошибка публикации' }
                        })
                    }
                >
                    Опубликовать
                </Button>
            </Row>
        </>
    );
}

function DefaultTrigger(): React.JSX.Element {
    const manager = Toast.useToastManager();
    return (
        <Button
            onClick={() => manager.add({ type: 'success', title: 'Изменения сохранены', description: 'Набор обновлён у всех участников.' })}
        >
            Показать уведомление
        </Button>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Stage args={args}>
                <DefaultTrigger />
            </Stage>
        </div>
    );
}

const meta = {
    title: 'Feedback/Toast',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component:
                    'Уведомления (Figma "Toast") внизу экрана. `type` красит иконку, warning и error — ещё и текст. Тосты складываются стопкой и раскрываются при наведении; смахиваются жестом.'
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
            <Section title='Типы, действие и промис' description='Нажмите несколько кнопок подряд — тосты сложатся в стопку.'>
                <Stage>
                    <Triggers />
                </Stage>
            </Section>
        </Page>
    )
};
