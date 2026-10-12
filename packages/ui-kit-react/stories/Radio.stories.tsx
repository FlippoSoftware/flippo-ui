import type * as React from 'react';

import { radio as recipe } from '@flippo-software/component-styles/radio';

import type { Meta, StoryObj } from '@storybook/react';

import { Radio, RadioGroup } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Options(props: Props & { defaultValue?: string }): React.JSX.Element {
    const { defaultValue = 'all', ...rest } = props;
    return (
        <RadioGroup defaultValue={defaultValue} aria-label='Режим повторения' orientation='horizontal'>
            {[
                ['all', 'Все карточки'],
                ['new', 'Только новые'],
                ['hard', 'Сложные']
            ].map(([value, label]) => (
                <Radio.Label key={value} size={rest.size}>
                    <Radio.Root {...rest} value={value}>
                        <Radio.Indicator />
                    </Radio.Root>
                    {label}
                </Radio.Label>
            ))}
        </RadioGroup>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Options {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/Radio',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component: 'Радиокнопка: круг 20px, выбранная заливается цветом бренда с белой точкой. Используется внутри `RadioGroup`.'
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
            <Section title='Размеры' description='16, 20 и 24px.'>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Options size={size} />
                    </Row>
                ))}
            </Section>
            <Section title='Недоступна' description='Недоступную радиокнопку видно, но выбрать нельзя.'>
                <Row label='disabled'>
                    <Options disabled={true} />
                </Row>
            </Section>
        </Page>
    )
};
