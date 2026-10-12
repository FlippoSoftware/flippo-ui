import type * as React from 'react';

import { toggleGroup as recipe } from '@flippo-software/component-styles/toggle-group';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Toggle, ToggleGroup } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Formatting(props: Props & { multiple?: boolean; defaultValue?: string[] }): React.JSX.Element {
    const { multiple = true, defaultValue = ['bold'], ...rest } = props;
    return (
        <ToggleGroup {...rest} multiple={multiple} defaultValue={defaultValue} aria-label='Форматирование текста'>
            <Toggle value='bold' aria-label='Жирный'>
                <Icon name='format-bold' />
            </Toggle>
            <Toggle value='italic' aria-label='Курсив'>
                <Icon name='format-italic' />
            </Toggle>
            <Toggle value='underline' aria-label='Подчёркнутый'>
                <Icon name='format-underline' />
            </Toggle>
            <Toggle value='list' aria-label='Список'>
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
                component: 'Группа переключателей: несколько независимых или один из нескольких; `contained` добавляет подложку.'
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
            <Section title='Оформление' description='Без подложки — в панелях инструментов; с подложкой — отдельно стоящая группа.'>
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
            <Section title='Один из нескольких' description='Без `multiple` нажатие выбирает один вариант, как переключатель вида.'>
                <Row label='single'>
                    <ToggleGroup contained={true} defaultValue={['list']} aria-label='Вид коллекции'>
                        <Toggle value='list' variant='labeled'>
                            <Icon name='format-list-ul' />
                            Список
                        </Toggle>
                        <Toggle value='cards' variant='labeled'>
                            <Icon name='set' />
                            Карточки
                        </Toggle>
                    </ToggleGroup>
                </Row>
            </Section>
        </Page>
    )
};
