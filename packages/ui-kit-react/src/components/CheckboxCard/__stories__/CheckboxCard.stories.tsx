import type * as React from 'react';

import { checkboxCard as recipe } from '@flippo-software/component-styles/checkbox-card';

import type { Meta, StoryObj } from '@storybook/react';

import { CheckboxCard, CheckboxGroup } from '~@src';
import { Grid, Page, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Option(props: Props & { title: string; text: string; value?: string; defaultChecked?: boolean }): React.JSX.Element {
    const { title, text, ...rest } = props;
    return (
        <CheckboxCard.Root {...rest}>
            <CheckboxCard.Indicator />
            <span style={{ display: 'grid', gap: 2 }}>
                <strong>{title}</strong>
                <span style={{ color: 'var(--fl-color-text-4)' }}>{text}</span>
            </span>
        </CheckboxCard.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Option {...args} title='Подсказки' text='Показывать подсказку под вопросом' />
        </div>
    );
}

const meta = {
    title: 'Forms/CheckboxCard',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component:
                    'Карточка-чекбокс: вся карточка переключает выбор. Индикатор всегда на месте (`keepMounted`), меняется только галочка — раскладка не прыгает.'
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
            <Section title='Положение индикатора' description='В начале карточки или в конце, как переключатель настройки.'>
                <Grid min={300}>
                    <Option title='Подсказки' text='Показывать подсказку под вопросом' defaultChecked={true} />
                    <Option title='Подробности' text='Блок с объяснением после ответа' />
                    <Option title='Подсказки' text='Показывать подсказку под вопросом' indicatorPosition='end' defaultChecked={true} />
                    <Option title='Подробности' text='Блок с объяснением после ответа' indicatorPosition='end' />
                </Grid>
            </Section>
            <Section title='Недоступна' description='Выбор виден, но не меняется.'>
                <Grid min={300}>
                    <Option title='Озвучка' text='Скоро будет доступно' disabled={true} />
                    <Option title='Синхронизация' text='Включена администратором' disabled={true} defaultChecked={true} />
                </Grid>
            </Section>
            <Section title='Группа' description='Несколько карточек в CheckboxGroup: значение — массив выбранных.'>
                <CheckboxGroup defaultValue={['hints']} aria-label='Блоки карточки'>
                    <Grid min={240}>
                        <Option value='hints' title='Подсказки' text='Под вопросом' />
                        <Option value='details' title='Подробности' text='После ответа' />
                        <Option value='image' title='Изображение' text='Над вопросом' />
                    </Grid>
                </CheckboxGroup>
            </Section>
        </Page>
    )
};
