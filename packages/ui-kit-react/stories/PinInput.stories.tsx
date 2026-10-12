import * as React from 'react';

import { pinInput as recipe } from '@flippo-software/component-styles/pin-input';

import type { Meta, StoryObj } from '@storybook/react';

import { PinInput } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean; invalid?: boolean; defaultValue?: string; mask?: boolean };

function Code(props: Props & { length?: number }): React.JSX.Element {
    const { length = 4, ...rest } = props;
    const [completed, setCompleted] = React.useState(false);
    return (
        <div className='sb-items sb-items--column' style={{ alignItems: 'flex-start' }}>
            <PinInput.Root {...rest} onValueComplete={() => setCompleted(true)}>
                <PinInput.Group>
                    <PinInput.FocusFunnel>
                        {Array.from({ length }, (_, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: the cells are positions
                            <PinInput.Pin key={index} aria-label={`Цифра ${index + 1}`} />
                        ))}
                    </PinInput.FocusFunnel>
                </PinInput.Group>
            </PinInput.Root>
            <output aria-live='polite' className='sb-caption'>
                {completed ? 'Код введён' : 'Введите код из письма'}
            </output>
        </div>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Code {...args} />
        </div>
    );
}

const meta = {
    title: 'Forms/PinInput',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: { component: 'Ввод кода (Figma "Numeric"): ячейки 64×80 по одной цифре; вставка из буфера заполняет все ячейки.' }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Состояния' description='Пустой, заполненный, с ошибкой и недоступный.'>
                <Row label='blank'>
                    <Code />
                </Row>
                <Row label='filled'>
                    <Code defaultValue='4271' />
                </Row>
                <Row label='wrong'>
                    <Code defaultValue='4271' invalid={true} />
                </Row>
                <Row label='disabled'>
                    <Code defaultValue='42' disabled={true} />
                </Row>
            </Section>
            <Section title='Размеры' description='Large 64×80 (Figma) и Medium 48×56 для форм потеснее.'>
                <Row label='large'>
                    <Code size='large' length={6} />
                </Row>
                <Row label='medium'>
                    <Code size='medium' length={6} />
                </Row>
            </Section>
            <Section title='На карточке' description='Inverted и скрытые символы (mask).' raised={true}>
                <Row label='inverted'>
                    <Code appearance='inverted' defaultValue='4271' mask={true} />
                </Row>
            </Section>
        </Page>
    )
};
