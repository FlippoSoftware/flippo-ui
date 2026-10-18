import type * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, DefaultPropsProvider, Icon, Input, SegmentedControl, Select } from '~@src';
import { Page, Row, Section, t } from '~@stories';

import type { DefaultProps } from '~@src';

type Size = 'small' | 'medium' | 'large';
type Props = { size: Size; appearance: 'light' | 'inverted'; buttonVariant: 'primary' | 'secondary' | 'outlined' };

const FILTERS = () => ({ all: t('common.allCards'), mine: t('common.mine'), done: t('common.completed') });

/** Components without size or look props: they take them from the provider. */
function Screen(): React.JSX.Element {
    return (
        <div className='sb-items sb-items--column' style={{ alignItems: 'stretch', maxInlineSize: 420 }}>
            <Input.Root placeholder={t('common.searchSets')}>
                <Input.Body>
                    <Input.Icon aria-hidden='true' />
                    <Input.Slot aria-label={t('common.searchSets')} />
                </Input.Body>
            </Input.Root>
            <Select.Root defaultValue='all' items={FILTERS()}>
                <Select.Trigger aria-label={t('common.filter')}>
                    <Select.Value />
                    <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                    <Select.Positioner>
                        <Select.Popup>
                            <Select.List>
                                {Object.entries(FILTERS()).map(([value, label]) => (
                                    <Select.Item key={value} value={value}>
                                        <Select.ItemText>{label}</Select.ItemText>
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.List>
                        </Select.Popup>
                    </Select.Positioner>
                </Select.Portal>
            </Select.Root>
            <SegmentedControl.Root defaultValue='week' aria-label={t('common.period')}>
                <SegmentedControl.Item value='day'>{t('common.day')}</SegmentedControl.Item>
                <SegmentedControl.Item value='week'>{t('common.week')}</SegmentedControl.Item>
                <SegmentedControl.Item value='month'>{t('common.month')}</SegmentedControl.Item>
            </SegmentedControl.Root>
            <div className='sb-items'>
                <Button>
                    <Icon name='plus' />

                    {t('common.createASet')}
                </Button>
                <Button variant='label'>{t('common.cancel')}</Button>
            </div>
        </div>
    );
}

function Example({ size, appearance, buttonVariant }: Props): React.JSX.Element {
    const defaults: DefaultProps = {
        button: { size, variant: buttonVariant },
        input: { size, appearance },
        select: { size, appearance, positioner: { sideOffset: 4 } },
        segmentedControl: { size }
    };
    return (
        <div className='story-example'>
            <DefaultPropsProvider defaults={defaults}>
                <Screen />
            </DefaultPropsProvider>
        </div>
    );
}

const meta = {
    title: 'Utilities/DefaultProps',
    component: Example,
    args: { size: 'small', appearance: 'light', buttonVariant: 'primary' },
    argTypes: {
        size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
        appearance: { control: 'inline-radio', options: ['light', 'inverted'] },
        buttonVariant: { control: 'inline-radio', options: ['primary', 'secondary', 'outlined'] }
    },
    parameters: {
        docs: {
            description: {
                component: 'defaultProps.description'
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
                title={t('defaultProps.sections.oneScreenDifferentSettings.title')}
                description={t('defaultProps.sections.oneScreenDifferentSettings.description')}
            >
                {(['small', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <DefaultPropsProvider
                            defaults={{ button: { size }, input: { size }, select: { size }, segmentedControl: { size } }}
                        >
                            <Screen />
                        </DefaultPropsProvider>
                    </Row>
                ))}
            </Section>
            <Section
                title={t('defaultProps.sections.nestedProvider.title')}
                description={t('defaultProps.sections.nestedProvider.description')}
            >
                <DefaultPropsProvider defaults={{ button: { size: 'small' } }}>
                    <Row label='outer'>
                        <Button>{t('common.save')}</Button>
                        <Button size='large'>{t('defaultProps.content.sizeQuotLargeQuot')}</Button>
                    </Row>
                    <DefaultPropsProvider defaults={{ button: { variant: 'outlined' } }}>
                        <Row label='inner'>
                            <Button>{t('common.save')}</Button>
                            <Button>{t('common.cancel')}</Button>
                        </Row>
                    </DefaultPropsProvider>
                </DefaultPropsProvider>
            </Section>
        </Page>
    )
};
