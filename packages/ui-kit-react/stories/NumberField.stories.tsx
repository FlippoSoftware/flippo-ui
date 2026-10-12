import type * as React from 'react';

import { numberField as recipe } from '@flippo-software/component-styles/number-field';

import type { Meta, StoryObj } from '@storybook/react';

import { NumberField } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Count(props: Props & { defaultValue?: number }): React.JSX.Element {
    return (
        <NumberField.Root defaultValue={10} min={1} max={50} {...props}>
            <NumberField.Group>
                <NumberField.Decrement aria-label='Меньше' />
                <NumberField.Input aria-label='Карточек за раз' />
                <NumberField.Increment aria-label='Больше' />
            </NumberField.Group>
        </NumberField.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Count {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/NumberField',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'Числовое поле с кнопками − и +; стрелки клавиатуры и колесо меняют значение, границы — `min` и `max`.'
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
                        <Count size={size} />
                    </Row>
                ))}
            </Section>
            <Section
                title='Оформление и состояния'
                description='Inverted — на карточке; на границе диапазона кнопка выключается.'
                raised={true}
            >
                <Row label='inverted'>
                    <Count appearance='inverted' />
                </Row>
                <Row label='at min'>
                    <Count appearance='inverted' defaultValue={1} />
                </Row>
                <Row label='disabled'>
                    <Count appearance='inverted' disabled={true} />
                </Row>
            </Section>
        </Page>
    )
};
