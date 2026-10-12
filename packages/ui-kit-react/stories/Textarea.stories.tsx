import type * as React from 'react';

import { textarea as recipe } from '@flippo-software/component-styles/textarea';

import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Answer(props: Props & { defaultValue?: string; rows?: number }): React.JSX.Element {
    return (
        <Textarea.Root placeholder='Введи текст ответа' rows={3} {...props}>
            <Textarea.Body>
                <Textarea.Slot aria-label='Ответ' />
            </Textarea.Body>
        </Textarea.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Answer {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Textarea',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: { description: { component: 'Многострочное поле: ответ карточки, описание набора. Рамка ведёт себя как у Input.' } }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Состояния' description='Пустое, заполненное и недоступное.'>
                <Row fill={true} label='blank'>
                    <Answer />
                </Row>
                <Row fill={true} label='filled'>
                    <Answer defaultValue='Пользователи воспринимают эстетичный дизайн как более удобный.' />
                </Row>
                <Row fill={true} label='disabled'>
                    <Answer disabled={true} defaultValue='Карточка заблокирована владельцем набора.' />
                </Row>
            </Section>
            <Section title='На карточке' description='Inverted — для полей на поверхности bg-1.' raised={true}>
                <Row fill={true} label='inverted'>
                    <Answer appearance='inverted' rows={4} />
                </Row>
            </Section>
        </Page>
    )
};
