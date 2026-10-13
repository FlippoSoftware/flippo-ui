import type * as React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, DefaultPropsProvider, Icon, Input, SegmentedControl, Select } from '~@src';
import { Page, Row, Section } from '~@stories';

import type { DefaultProps } from '~@src';

type Size = 'small' | 'medium' | 'large';
type Props = { size: Size; appearance: 'light' | 'inverted'; buttonVariant: 'primary' | 'secondary' | 'outlined' };

const FILTERS = { all: 'Все карточки', mine: 'Мои', done: 'Готовые' };

/** Components without size or look props: they take them from the provider. */
function Screen(): React.JSX.Element {
    return (
        <div className='sb-items sb-items--column' style={{ alignItems: 'stretch', maxInlineSize: 420 }}>
            <Input.Root placeholder='Поиск наборов'>
                <Input.Body>
                    <Input.Icon aria-hidden='true' />
                    <Input.Slot aria-label='Поиск наборов' />
                </Input.Body>
            </Input.Root>
            <Select.Root defaultValue='all' items={FILTERS}>
                <Select.Trigger aria-label='Фильтр'>
                    <Select.Value />
                    <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                    <Select.Positioner>
                        <Select.Popup>
                            <Select.List>
                                {Object.entries(FILTERS).map(([value, label]) => (
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
            <SegmentedControl.Root defaultValue='week' aria-label='Период'>
                <SegmentedControl.Item value='day'>День</SegmentedControl.Item>
                <SegmentedControl.Item value='week'>Неделя</SegmentedControl.Item>
                <SegmentedControl.Item value='month'>Месяц</SegmentedControl.Item>
            </SegmentedControl.Root>
            <div className='sb-items'>
                <Button>
                    <Icon name='plus' />
                    Создать набор
                </Button>
                <Button variant='label'>Отмена</Button>
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
                component:
                    '`DefaultPropsProvider` задаёт props по умолчанию для семейств кита: `{ button: { size }, select: { size, positioner: { sideOffset } } }`. Ключ семейства — имя компонента с маленькой буквы, ключ части — имя части (`positioner`, `trigger`). Порядок: prop на компоненте → запись части → то, что передаёт корень → запись семейства → встроенные умолчания. Вложенные провайдеры сливаются с внешними.'
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
            <Section title='Один экран, разные настройки' description='Компоненты не задают ни размер, ни вид — их даёт провайдер.'>
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
                title='Вложенный провайдер'
                description='Внешний задаёт размер, внутренний — вид кнопок только для своей области; prop на компоненте всё равно главнее.'
            >
                <DefaultPropsProvider defaults={{ button: { size: 'small' } }}>
                    <Row label='outer'>
                        <Button>Сохранить</Button>
                        <Button size='large'>size=&quot;large&quot; на кнопке</Button>
                    </Row>
                    <DefaultPropsProvider defaults={{ button: { variant: 'outlined' } }}>
                        <Row label='inner'>
                            <Button>Сохранить</Button>
                            <Button>Отмена</Button>
                        </Row>
                    </DefaultPropsProvider>
                </DefaultPropsProvider>
            </Section>
        </Page>
    )
};
