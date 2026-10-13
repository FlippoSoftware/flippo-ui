import type * as React from 'react';

import { combobox as recipe } from '@flippo-software/component-styles/combobox';

import type { Meta, StoryObj } from '@storybook/react';

import { Combobox } from '~@src';
import { Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const LAWS = ['Закон Якоба', 'Закон Фиттса', 'Закон Хика', 'Закон близости', 'Закон Миллера', 'Эффект эстетики', 'Закон Теслера'];

function Laws(props: Props & { multiple?: boolean; defaultValue?: unknown }): React.JSX.Element {
    const { multiple, ...rest } = props;
    return (
        <Combobox.Root {...rest} items={LAWS} multiple={multiple}>
            <Combobox.InputGroup>
                {multiple ? (
                    <Combobox.Chips>
                        <Combobox.Value>
                            {(values: string[]) =>
                                values.map((value) => (
                                    <Combobox.Chip key={value} aria-label={value}>
                                        <Combobox.ChipLabel>{value}</Combobox.ChipLabel>
                                        <Combobox.ChipRemove aria-label={`Убрать ${value}`} />
                                    </Combobox.Chip>
                                ))
                            }
                        </Combobox.Value>
                        <Combobox.Input aria-label='Законы' placeholder='Добавить закон…' />
                    </Combobox.Chips>
                ) : (
                    <Combobox.Input aria-label='Закон' placeholder='Найти закон…' />
                )}
                <Combobox.Clear aria-label='Очистить' />
                <Combobox.Trigger aria-label='Показать законы' />
            </Combobox.InputGroup>
            <Combobox.Portal>
                <Combobox.Positioner>
                    <Combobox.Popup>
                        <Combobox.Empty>Ничего не найдено</Combobox.Empty>
                        <Combobox.List>
                            {(value: string) => (
                                <Combobox.Item key={value} value={value}>
                                    {value}
                                    <Combobox.ItemIndicator />
                                </Combobox.Item>
                            )}
                        </Combobox.List>
                    </Combobox.Popup>
                </Combobox.Positioner>
            </Combobox.Portal>
        </Combobox.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Laws {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Combobox',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component:
                    'Поле с выбором из списка: ввод фильтрует варианты, список по ширине поля. С `multiple` выбранные значения становятся чипами внутри поля.'
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
                        <div className='sb-medium'>
                            <Laws size={size} />
                        </div>
                    </Row>
                ))}
            </Section>
            <Section title='Несколько значений' description='Выбранные значения — чипы; Backspace удаляет последний.'>
                <div className='sb-medium'>
                    <Laws multiple={true} chips={true} defaultValue={['Закон Якоба', 'Закон Хика']} />
                </div>
            </Section>
            <Section title='На карточке' description='Inverted и недоступное поле.' raised={true}>
                <Row label='inverted'>
                    <div className='sb-medium'>
                        <Laws appearance='inverted' defaultValue='Закон Фиттса' />
                    </div>
                </Row>
                <Row label='disabled'>
                    <div className='sb-medium'>
                        <Laws appearance='inverted' disabled={true} defaultValue='Закон Фиттса' />
                    </div>
                </Row>
            </Section>
        </Page>
    )
};
