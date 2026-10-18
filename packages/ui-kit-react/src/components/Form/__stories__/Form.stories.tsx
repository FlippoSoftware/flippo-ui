import * as React from 'react';

import { form as recipe } from '@flippo-software/component-styles/form';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Field, Form, Icon, Switch } from '~@src';
import { Card, Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function NewSet(props: Props): React.JSX.Element {
    const [created, setCreated] = React.useState('');
    return (
        <Form
            {...props}
            onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                setCreated(String(data.get('title') ?? ''));
            }}
        >
            <Field.Root name='title'>
                <Field.Label>{t('common.name')}</Field.Label>
                <Field.Control control='input' required={true} placeholder={t('form.placeholders.uxLawsSay')} />
                <Field.Error match='valueMissing'>{t('form.content.enterTheNameOf')}</Field.Error>
            </Field.Root>
            <Field.Root name='description'>
                <Field.Label>{t('form.content.description')}</Field.Label>
                <Field.Control control='input' placeholder={t('form.placeholders.whatThisSetIs')} />
                <Field.Description>{t('form.content.optional')}</Field.Description>
            </Field.Root>
            <Switch.Label>
                <Switch.Root name='public' defaultChecked={true}>
                    <Switch.Thumb />
                </Switch.Root>

                {t('form.content.visibleInTheCommunity')}
            </Switch.Label>
            <div className='sb-items'>
                <Button type='submit'>
                    <Icon name='plus' />

                    {t('common.createASet')}
                </Button>
                <Button type='reset' variant='label'>
                    {t('form.content.reset')}
                </Button>
            </div>
            <output aria-live='polite' className='sb-caption'>
                {created ? `${t('form.content.createdTheSet')}${created}»` : ''}
            </output>
        </Form>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <NewSet {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Form',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'form.description'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Examples: Story = {
    render: () => (
        <Page>
            <Section title={t('form.sections.newSet.title')} description={t('form.sections.newSet.description')}>
                <div className='sb-medium'>
                    <Card>
                        <NewSet />
                    </Card>
                </div>
            </Section>
        </Page>
    )
};
