import * as React from 'react';

import { contextMenu as recipe } from '@flippo-software/component-styles/context-menu';

import type { Meta, StoryObj } from '@storybook/react';

import { ContextMenu, Icon } from '~@src';
import { Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function SetCard(props: Props & { onAction?: (action: string) => void }): React.JSX.Element {
    const { onAction = () => undefined, ...rest } = props;
    return (
        <ContextMenu.Root {...rest}>
            <ContextMenu.Trigger className='sb-card' style={{ cursor: 'context-menu' }}>
                <span className='sb-caption' style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fl-color-set)' }}>
                    <Icon name='set' />

                    {t('contextMenu.content.32Cards')}
                </span>
                <strong>{t('common.uxLawsExam')}</strong>
                <span className='sb-caption'>{t('contextMenu.content.rightClickOrLong')}</span>
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
                <ContextMenu.Positioner>
                    <ContextMenu.Popup>
                        <ContextMenu.Item onClick={() => onAction(t('contextMenu.content.opened'))}>
                            <Icon name='preview' />

                            {t('contextMenu.content.open')}
                        </ContextMenu.Item>
                        <ContextMenu.Item onClick={() => onAction(t('contextMenu.content.renaming'))}>
                            <Icon name='pencil' />

                            {t('common.rename')}
                        </ContextMenu.Item>
                        <ContextMenu.Item onClick={() => onAction(t('common.linkCopied'))}>
                            <Icon name='link' />

                            {t('contextMenu.content.copyTheLink')}
                        </ContextMenu.Item>
                        <ContextMenu.Separator />
                        <ContextMenu.Item tone='destructive' onClick={() => onAction(t('contextMenu.content.deleted'))}>
                            <Icon name='delete' />

                            {t('common.deleteTheSet')}
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
        docs: { description: { component: 'contextMenu.description' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title={t('contextMenu.sections.setCard.title')} description={t('contextMenu.sections.setCard.description')}>
                <div className='sb-narrow'>
                    <SetCard />
                </div>
            </Section>
        </Page>
    )
};
