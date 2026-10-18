import type * as React from 'react';

import { toolbar as recipe } from '@flippo-software/component-styles/toolbar';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Toggle, ToggleGroup, Toolbar } from '~@src';
import { Page, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Editor(props: Props): React.JSX.Element {
    return (
        <Toolbar.Root {...props} aria-label={t('toolbar.labels.cardFormatting')}>
            <ToggleGroup multiple={true} aria-label={t('toolbar.labels.style')}>
                <Toolbar.Button render={<Toggle value='bold' aria-label={t('common.bold')} />}>
                    <Icon name='format-bold' />
                </Toolbar.Button>
                <Toolbar.Button render={<Toggle value='italic' aria-label={t('common.italic')} />}>
                    <Icon name='format-italic' />
                </Toolbar.Button>
                <Toolbar.Button render={<Toggle value='underline' aria-label={t('common.underlined')} />}>
                    <Icon name='format-underline' />
                </Toolbar.Button>
            </ToggleGroup>
            <Toolbar.Separator />
            <Toolbar.Group aria-label={t('toolbar.labels.blocks')}>
                <Toolbar.Button>
                    <Icon name='hint' />

                    {t('common.hint')}
                </Toolbar.Button>
                <Toolbar.Button>
                    <Icon name='format-list-ul' />

                    {t('common.list')}
                </Toolbar.Button>
            </Toolbar.Group>
            <Toolbar.Separator />
            <Toolbar.Link href='#help'>{t('common.help')}</Toolbar.Link>
        </Toolbar.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Editor {...args} />
        </div>
    );
}

const meta = {
    title: 'Navigation/Toolbar',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component: 'toolbar.description'
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
            <Section title={t('toolbar.sections.cardEditor.title')} description={t('toolbar.sections.cardEditor.description')}>
                <Editor />
            </Section>
            <Section title={t('toolbar.sections.withSearch.title')} description={t('toolbar.sections.withSearch.description')}>
                <Toolbar.Root aria-label={t('common.set')}>
                    <Toolbar.Button>
                        <Icon name='plus' />

                        {t('toolbar.content.card')}
                    </Toolbar.Button>
                    <Toolbar.Button>
                        <Icon name='shuffle' />

                        {t('common.shuffle')}
                    </Toolbar.Button>
                    <Toolbar.Separator />
                    <Toolbar.Input aria-label={t('toolbar.labels.searchCards')} placeholder={t('toolbar.placeholders.searchCards')} />
                </Toolbar.Root>
            </Section>
        </Page>
    )
};
