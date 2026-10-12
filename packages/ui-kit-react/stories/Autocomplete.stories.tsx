import type * as React from 'react';

import { autocomplete as recipe } from '@flippo-software/component-styles/autocomplete';

import type { Meta, StoryObj } from '@storybook/react';

import { Autocomplete, Icon } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const SETS = ['Экзамен Законы UX', 'Новый набор', 'C++', 'Английский B2', 'История искусств', 'Психология восприятия'];

function Search(props: Props): React.JSX.Element {
    return (
        <Autocomplete.Root {...props} items={SETS}>
            <Autocomplete.InputGroup>
                <Icon name='magnifier' className='fl-combobox-icon' />
                <Autocomplete.Input aria-label='Поиск наборов' placeholder='Поиск наборов' />
                <Autocomplete.Clear aria-label='Очистить' />
            </Autocomplete.InputGroup>
            <Autocomplete.Portal>
                <Autocomplete.Positioner>
                    <Autocomplete.Popup>
                        <Autocomplete.Empty>Наборов не найдено</Autocomplete.Empty>
                        <Autocomplete.List>
                            {(value: string) => (
                                <Autocomplete.Item key={value} value={value}>
                                    <Icon name='set' />
                                    {value}
                                </Autocomplete.Item>
                            )}
                        </Autocomplete.List>
                    </Autocomplete.Popup>
                </Autocomplete.Positioner>
            </Autocomplete.Portal>
        </Autocomplete.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Search {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Autocomplete',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component:
                    'Поиск с подсказками: значение поля — свободный текст, список предлагает варианты. Открывается при нажатии на поле и при вводе.'
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
            <Section title='Строка поиска' description='Figma "Searchbar": лупа слева, крестик очистки появляется с текстом.'>
                {(['large', 'medium', 'small'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <div className='sb-medium'>
                            <Search size={size} />
                        </div>
                    </Row>
                ))}
            </Section>
            <Section title='На карточке' description='Inverted и недоступное поле.' raised={true}>
                <Row label='inverted'>
                    <div className='sb-medium'>
                        <Search appearance='inverted' />
                    </div>
                </Row>
                <Row label='disabled'>
                    <div className='sb-medium'>
                        <Search appearance='inverted' disabled={true} />
                    </div>
                </Row>
            </Section>
        </Page>
    )
};
