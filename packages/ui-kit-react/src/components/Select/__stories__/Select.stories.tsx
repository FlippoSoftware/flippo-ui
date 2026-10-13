import type * as React from 'react';

import { select as recipe } from '@flippo-software/component-styles/select';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Field, Icon, Select } from '~@src';
import { Grid, Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const FILTERS: [string, string][] = [
    ['all', 'Все карточки'],
    ['mine', 'Мои'],
    ['free', 'Свободные'],
    ['assigned', 'Назначенные'],
    ['done', 'Готовые'],
    ['repeat', 'На повторении']
];

function Filter(props: Props & { defaultValue?: string | null; placeholder?: string }): React.JSX.Element {
    const { defaultValue = 'all', placeholder, ...rest } = props;
    return (
        <Select.Root {...rest} defaultValue={defaultValue} items={Object.fromEntries(FILTERS)}>
            <Select.Trigger aria-label='Фильтр карточек'>
                <Select.Value placeholder={placeholder} />
                <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
                <Select.Positioner>
                    <Select.Popup>
                        <Select.List>
                            {FILTERS.map(([value, label]) => (
                                <Select.Item key={value} value={value} disabled={value === 'done'}>
                                    <Select.ItemText>{label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.List>
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
}

const FOLDERS: [string, IconName, string][] = [
    ['self', 'learn', 'Саморазвитие'],
    ['term', 'folder', '2 семестр'],
    ['exam', 'set', 'Экзамены']
];

function Folder(): React.JSX.Element {
    return (
        <Select.Root defaultValue='term' items={Object.fromEntries(FOLDERS.map(([value, , label]) => [value, label]))}>
            <Select.Trigger aria-label='Папка'>
                <Select.Value />
                <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
                <Select.Positioner>
                    <Select.Popup>
                        <Select.Group>
                            <Select.GroupLabel>Ваши папки</Select.GroupLabel>
                            {FOLDERS.map(([value, icon, label]) => (
                                <Select.Item key={value} value={value}>
                                    <Icon name={icon} />
                                    <Select.ItemText>{label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Filter {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Select',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component:
                    'Выпадающий список: триггер выглядит как поле, список открывается под ним с отступом 8px. После выбора мышью триггер остаётся в фокусе, но подсвечивается только при фокусе с клавиатуры.'
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
            <Section title='Размеры' description='Large, Medium и Small, как у Input.'>
                {(['large', 'medium', 'small'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <div className='sb-narrow'>
                            <Filter size={size} />
                        </div>
                    </Row>
                ))}
            </Section>
            <Section
                title='Оформление и состояния'
                description='Inverted — на карточке; плейсхолдер, пока ничего не выбрано.'
                raised={true}
            >
                <Grid min={260}>
                    <Filter appearance='inverted' />
                    <Filter appearance='inverted' defaultValue={null} placeholder='Выберите фильтр' />
                    <Filter appearance='inverted' disabled={true} />
                </Grid>
            </Section>
            <Section title='С группой и иконками' description='Заголовок группы и иконка у каждого пункта.'>
                <div className='sb-narrow'>
                    <Field.Root>
                        <Field.Label>Папка</Field.Label>
                        <Folder />
                    </Field.Root>
                </div>
            </Section>
        </Page>
    )
};
