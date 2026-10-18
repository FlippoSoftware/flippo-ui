import type * as React from 'react';

import { toggle as recipe } from '@flippo-software/component-styles/toggle';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Toggle } from '~@src';
import { Page, Row, Section, t, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Toggle {...args} aria-label={t('common.shuffle')}>
                <Icon name='shuffle' />
                {args.variant === 'labeled' ? t('common.shuffle') : null}
            </Toggle>
        </div>
    );
}

const meta = {
    title: 'Actions/Toggle',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'toggle.description'
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
            <Section title={t('toggle.sections.icon.title')} description={t('toggle.sections.icon.description')}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Toggle size={size} aria-label={t('common.shuffle')}>
                            <Icon name='shuffle' />
                        </Toggle>
                        <Toggle size={size} defaultPressed={true} aria-label={t('common.shuffle')}>
                            <Icon name='shuffle' />
                        </Toggle>
                        <Toggle size={size} aria-label={t('toggle.labels.addToFavourites')}>
                            <Icon name='favorite' />
                        </Toggle>
                        <Toggle size={size} disabled={true} aria-label={t('common.shuffle')}>
                            <Icon name='shuffle' />
                        </Toggle>
                        <Toggle size={size} disabled={true} defaultPressed={true} aria-label={t('common.shuffle')}>
                            <Icon name='shuffle' />
                        </Toggle>
                    </Row>
                ))}
            </Section>
            <Section title={t('toggle.sections.labeled.title')} description={t('toggle.sections.labeled.description')}>
                <Row label='off / on'>
                    <Toggle variant='labeled'>
                        <Icon name='shuffle' />
                        Off
                    </Toggle>
                    <Toggle variant='labeled' defaultPressed={true}>
                        <Icon name='shuffle' />
                        On
                    </Toggle>
                    <Toggle variant='labeled' defaultPressed={true}>
                        <Icon name='hint' />

                        {t('common.hints')}
                    </Toggle>
                </Row>
                <Row label='disabled'>
                    <Toggle variant='labeled' disabled={true}>
                        <Icon name='shuffle' />
                        Off
                    </Toggle>
                    <Toggle variant='labeled' disabled={true} defaultPressed={true}>
                        <Icon name='shuffle' />
                        On
                    </Toggle>
                </Row>
            </Section>
        </Page>
    )
};
