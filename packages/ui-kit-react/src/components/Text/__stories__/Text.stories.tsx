import type * as React from 'react';

import { text as recipe } from '@flippo-software/component-styles/text';

import type { Meta, StoryObj } from '@storybook/react';

import { Text } from '~@src';
import { Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Text {...args}>Закон Хика: время решения растёт с числом вариантов.</Text>
        </div>
    );
}

const meta = {
    title: 'Typography/Text',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component:
                    'Текст по типографической шкале Figma: `size` × `weight` дают класс `fl-text-<size>-<weight>`; цвет, выравнивание, регистр и обрезка — отдельными вариантами.'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const SIZES = [
    'display-1',
    'display-2',
    'title-1',
    'title-2',
    'title-3',
    'heading-1',
    'heading-2',
    'heading-3',
    'body-plus',
    'body',
    'body-minus',
    'label'
] as const;
const COLORS = ['primary', 'secondary', 'tertiary', 'quaternary', 'disabled', 'brand', 'success', 'warning', 'error'] as const;

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Шкала' description='Все размеры в весе default.'>
                {SIZES.map((size) => (
                    <Row key={size} label={size}>
                        <Text size={size} truncate={true}>
                            Экзамен Законы UX
                        </Text>
                    </Row>
                ))}
            </Section>
            <Section title='Насыщенность'>
                {(['weaker', 'default', 'stronger'] as const).map((weight) => (
                    <Row key={weight} label={weight}>
                        <Text size='body-plus' weight={weight}>
                            Повторяйте сложные карточки чаще
                        </Text>
                    </Row>
                ))}
            </Section>
            <Section title='Цвета'>
                <Row label='color'>
                    {COLORS.map((color) => (
                        <Text key={color} color={color}>
                            {color}
                        </Text>
                    ))}
                </Row>
            </Section>
            <Section title='Обрезка' description='`truncate` — одна строка с многоточием.'>
                <div className='sb-narrow'>
                    <Text truncate={true}>JavaScript: замыкания, контекст выполнения, прототипы и цепочка областей видимости</Text>
                </div>
            </Section>
        </Page>
    )
};
