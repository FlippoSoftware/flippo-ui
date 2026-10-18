import type * as React from 'react';

import { dialog as recipe } from '@flippo-software/component-styles/dialog';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Dialog, Field, Icon } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function DeleteSet(props: Props): React.JSX.Element {
    return (
        <Dialog.Root {...props}>
            <Dialog.Trigger render={<Button variant='danger' />}>
                <Icon name='delete' />

                {t('common.deleteTheSet')}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                    <Dialog.Title>{t('dialog.content.deleteTheSet')}</Dialog.Title>
                    <Dialog.Description>{t('dialog.content.uxLawsExamAnd')}</Dialog.Description>
                    <Dialog.Actions>
                        <Dialog.Close render={<Button variant='label' />}>{t('common.cancel')}</Dialog.Close>
                        <Dialog.Close render={<Button variant='danger' />}>{t('common.delete')}</Dialog.Close>
                    </Dialog.Actions>
                    <Dialog.Close aria-label={t('common.close')} />
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function RenameSet(props: Props): React.JSX.Element {
    return (
        <Dialog.Root {...props}>
            <Dialog.Trigger render={<Button variant='secondary' />}>
                <Icon name='pencil' />

                {t('common.rename')}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Popup>
                    <Dialog.Title>{t('dialog.content.newName')}</Dialog.Title>
                    <Field.Root name='title'>
                        <Field.Label>{t('common.setName')}</Field.Label>
                        <Field.Control control='input' defaultValue={t('common.uxLawsExam')} appearance='inverted' />
                    </Field.Root>
                    <Dialog.Actions>
                        <Dialog.Close render={<Button variant='label' />}>{t('common.cancel')}</Dialog.Close>
                        <Dialog.Close render={<Button />}>{t('common.save')}</Dialog.Close>
                    </Dialog.Actions>
                    <Dialog.Close aria-label={t('common.close')} />
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <DeleteSet {...args} />
        </div>
    );
}

const meta = {
    title: 'Overlays/Dialog',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'dialog.description'
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
                title={t('dialog.sections.confirmationAndForm.title')}
                description={t('dialog.sections.confirmationAndForm.description')}
            >
                <Row label='confirm'>
                    <DeleteSet />
                </Row>
                <Row label='form'>
                    <RenameSet />
                </Row>
            </Section>
            <Section title={t('dialog.sections.sizes.title')} description={t('dialog.sections.sizes.description')}>
                <Row label='sizes'>
                    <RenameSet size='small' />
                    <RenameSet size='medium' />
                    <RenameSet size='large' />
                </Row>
            </Section>
        </Page>
    )
};
