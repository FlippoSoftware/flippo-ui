import type * as React from 'react';

import { accordion as recipe } from '@flippo-software/component-styles/accordion';

import type { Meta, StoryObj } from '@storybook/react';

import { Accordion } from '~@src';
import { Card, Page, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { multiple?: boolean; disabled?: boolean; defaultValue?: string[] };

const LAWS = [
    ['aesthetic', 'Эффект эстетики', 'Пользователи воспринимают эстетичный дизайн как более удобный.'],
    ['proximity', 'Закон близости', 'Элементы, расположенные близко друг к другу, воспринимаются как группа.'],
    ['jakob', 'Закон Якоба', 'Пользователи проводят больше времени на других сайтах и ждут, что ваш работает так же.'],
    ['hick', 'Закон Хика', 'Время принятия решения растёт с числом и сложностью вариантов.']
] as const;

function Laws(props: Props): React.JSX.Element {
    return (
        <Accordion.Root defaultValue={['aesthetic']} {...props}>
            {LAWS.map(([value, title, text]) => (
                <Accordion.Item key={value} value={value}>
                    <Accordion.Header>
                        <Accordion.Trigger>
                            {title}
                            <Accordion.Icon />
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel>
                        <Accordion.Content>{text}</Accordion.Content>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion.Root>
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
    title: 'Disclosure/Accordion',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), multiple: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'Аккордеон: панели раскрываются плавно по высоте содержимого; `multiple` позволяет открыть несколько сразу.'
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
            <Section title='Одна открытая панель' description='Открытие новой панели закрывает предыдущую.'>
                <div className='sb-medium'>
                    <Laws />
                </div>
            </Section>
            <Section title='Несколько панелей' description='С `multiple`; на карточке.'>
                <div className='sb-medium'>
                    <Card>
                        <Laws multiple={true} defaultValue={['aesthetic', 'jakob']} />
                    </Card>
                </div>
            </Section>
        </Page>
    )
};
