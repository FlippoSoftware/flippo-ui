import type * as React from 'react';

import { toggleGroup as recipe } from '@flippo-software/component-styles/toggle-group';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Toggle, ToggleGroup } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Formatting(props: Props & { multiple?: boolean; defaultValue?: string[] }): React.JSX.Element {
    const { multiple = true, defaultValue = ['bold'], ...rest } = props;
    return (
        <ToggleGroup {...rest} multiple={multiple} defaultValue={defaultValue} aria-label={t('toggleGroup.labels.textFormatting')}>
            <Toggle value='bold' aria-label={t('common.bold')}>
                <Icon name='format-bold' />
            </Toggle>
            <Toggle value='italic' aria-label={t('common.italic')}>
                <Icon name='format-italic' />
            </Toggle>
            <Toggle value='underline' aria-label={t('common.underlined')}>
                <Icon name='format-underline' />
            </Toggle>
            <Toggle value='list' aria-label={t('common.list')}>
                <Icon name='format-list-ul' />
            </Toggle>
        </ToggleGroup>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Formatting {...args} />
        </div>
    );
}

const meta = {
    title: 'Actions/ToggleGroup',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'toggleGroup.description'
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
            <Section title={t('toggleGroup.sections.look.title')} description={t('toggleGroup.sections.look.description')}>
                <Row label='plain'>
                    <Formatting />
                </Row>
                <Row label='contained'>
                    <Formatting contained={true} />
                </Row>
                <Row label='disabled'>
                    <Formatting contained={true} disabled={true} />
                </Row>
            </Section>
            <Section title={t('toggleGroup.sections.oneOfSeveral.title')} description={t('toggleGroup.sections.oneOfSeveral.description')}>
                <Row label='single'>
                    <ToggleGroup contained={true} defaultValue={['list']} aria-label={t('toggleGroup.labels.collectionView')}>
                        <Toggle value='list' variant='labeled'>
                            <Icon name='format-list-ul' />

                            {t('common.list')}
                        </Toggle>
                        <Toggle value='cards' variant='labeled'>
                            <Icon name='set' />

                            {t('common.cards')}
                        </Toggle>
                    </ToggleGroup>
                </Row>
            </Section>
        </Page>
    )
};
