import type * as React from 'react';

import { toast as recipe } from '@flippo-software/component-styles/toast';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon, Spinner, Toast } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

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
                    <Toast.Close aria-label={t('toast.labels.closeTheNotification')} />
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
                <Button variant='secondary' onClick={() => manager.add({ type: 'success', title: t('toast.content.setSaved') })}>
                    {t('toast.content.success')}
                </Button>
                <Button variant='secondary' onClick={() => manager.add({ type: 'info', title: t('common.linkCopied') })}>
                    {t('toast.content.info')}
                </Button>
                <Button
                    variant='secondary'
                    onClick={() =>
                        manager.add({
                            type: 'warning',
                            title: t('toast.content.noConnection'),
                            description: t('toast.content.yourChangesWillBe')
                        })
                    }
                >
                    {t('toast.content.warning')}
                </Button>
                <Button
                    variant='secondary'
                    onClick={() =>
                        manager.add({ type: 'error', title: t('toast.content.couldNotDelete'), description: t('toast.content.tryAgain') })
                    }
                >
                    {t('toast.content.error')}
                </Button>
                <Button variant='secondary' onClick={() => manager.add({ type: 'like', title: t('toast.content.addedToFavourites') })}>
                    {t('toast.content.like')}
                </Button>
            </Row>
            <Row label='action'>
                <Button
                    variant='danger'
                    onClick={() => {
                        const id = manager.add({
                            title: t('toast.content.cardDeleted'),
                            actionProps: { children: t('toast.content.undo'), onClick: () => manager.close(id) }
                        });
                    }}
                >
                    <Icon name='delete' />

                    {t('toast.content.deleteWithUndo')}
                </Button>
            </Row>
            <Row label='promise'>
                <Button
                    onClick={() =>
                        manager.promise(new Promise((resolve) => setTimeout(resolve, 1600)), {
                            loading: { title: t('toast.content.publishingTheSet') },
                            success: { title: t('toast.content.setPublished') },
                            error: { title: t('toast.content.publishingFailed') }
                        })
                    }
                >
                    {t('toast.content.publish')}
                </Button>
            </Row>
        </>
    );
}

function DefaultTrigger(): React.JSX.Element {
    const manager = Toast.useToastManager();
    return (
        <Button
            onClick={() =>
                manager.add({ type: 'success', title: t('toast.content.changesSaved'), description: t('toast.content.theSetIsUpdated') })
            }
        >
            {t('toast.content.showANotification')}
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
                component: 'toast.description'
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
            <Section
                title={t('toast.sections.typesActionAndPromise.title')}
                description={t('toast.sections.typesActionAndPromise.description')}
            >
                <Stage>
                    <Triggers />
                </Stage>
            </Section>
        </Page>
    )
};
