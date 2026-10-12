import type * as React from 'react';

import { input as recipe } from '@flippo-software/component-styles/input';

import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Search(props: Props & { defaultValue?: string; placeholder?: string; invalid?: boolean }): React.JSX.Element {
    const { invalid, placeholder = 'Поиск', ...rest } = props;
    return (
        <Input.Root {...rest} placeholder={placeholder}>
            <Input.Body data-invalid={invalid ? '' : undefined}>
                <Input.Icon aria-hidden='true' />
                <Input.Slot aria-label={placeholder} aria-invalid={invalid} />
                <Input.Clear aria-label='Очистить' />
            </Input.Body>
        </Input.Root>
    );
}

function Plain(props: Props & { defaultValue?: string; placeholder?: string }): React.JSX.Element {
    return (
        <Input.Root placeholder='Название набора' {...props}>
            <Input.Body>
                <Input.Slot aria-label='Название набора' />
            </Input.Body>
        </Input.Root>
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
    title: 'Forms/Input',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component:
                    'Поле ввода (Figma "Input Field", "Searchbar"): light — на странице, inverted — на карточке, underline — правка текста на месте. Нажатие в любом месте рамки фокусирует поле.'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function States(props: Props): React.JSX.Element {
    return (
        <>
            <Row fill={true} label='blank'>
                <Search {...props} />
            </Row>
            <Row fill={true} label='filled'>
                <Search {...props} defaultValue='Законы UX' />
            </Row>
            <Row fill={true} label='wrong'>
                <Search {...props} defaultValue='Закон Яко' invalid={true} />
            </Row>
            <Row fill={true} label='disabled'>
                <Search {...props} defaultValue='Недоступно' disabled={true} />
            </Row>
        </>
    );
}

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Light' description='Поле на фоне страницы. Наведение подсвечивает рамку, фокус — цветом бренда.'>
                <States appearance='light' />
            </Section>
            <Section title='Inverted' description='Поле на карточке (bg-1): темнее подложки, чтобы читалось.' raised={true}>
                <States appearance='inverted' />
            </Section>
            <Section title='Размеры' description='Large 56 (Body), Medium 48 и Small 40 (Body–).'>
                {(['large', 'medium', 'small'] as const).map((size) => (
                    <Row key={size} fill={true} label={size}>
                        <Search size={size} defaultValue='Закон Якоба' />
                    </Row>
                ))}
            </Section>
            <Section title='Underline' description='Заголовок, который редактируют на месте: с линией или без неё до наведения.'>
                <Row fill={true} label='visible line'>
                    <Plain appearance='underline' defaultValue='Экзамен Законы UX' />
                </Row>
                <Row fill={true} label='invisible line'>
                    <Plain appearance='underline-invisible' defaultValue='Экзамен Законы UX' />
                </Row>
                <Row fill={true} label='blank'>
                    <Plain appearance='underline' placeholder='Введи заголовок' />
                </Row>
            </Section>
        </Page>
    )
};
