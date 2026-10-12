import type * as React from 'react';

import { checkbox as recipe } from '@flippo-software/component-styles/checkbox';

import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Option(props: Props & { label: string; defaultChecked?: boolean; indeterminate?: boolean }): React.JSX.Element {
    const { label, ...rest } = props;
    return (
        <Checkbox.Label size={rest.size}>
            <Checkbox.Root {...rest}>
                <Checkbox.Indicator />
            </Checkbox.Root>
            {label}
        </Checkbox.Label>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Option {...args} label='Перемешивать карточки' />
        </div>
    );
}

const meta = {
    title: 'Forms/Checkbox',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component:
                    'Чекбокс: рамка 20px, при выборе заливается цветом бренда. Индикатор сам рисует галочку или минус (indeterminate). `Checkbox.Label` — `<label>` вокруг чекбокса и текста.'
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
            <Section title='Состояния' description='Выключен, включён, частично выбран и недоступен.'>
                <Row label='enabled'>
                    <Option label='Не выбран' />
                    <Option label='Выбран' defaultChecked={true} />
                    <Option label='Частично' indeterminate={true} />
                </Row>
                <Row label='disabled'>
                    <Option label='Не выбран' disabled={true} />
                    <Option label='Выбран' disabled={true} defaultChecked={true} />
                    <Option label='Частично' disabled={true} indeterminate={true} />
                </Row>
            </Section>
            <Section title='Размеры' description='16, 20 и 24px; галочка масштабируется вместе с рамкой.'>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Option size={size} label='Не выбран' />
                        <Option size={size} label='Выбран' defaultChecked={true} />
                        <Option size={size} label='Частично' indeterminate={true} />
                    </Row>
                ))}
            </Section>
        </Page>
    )
};
