import type * as React from 'react';

import { toggle as recipe } from '@flippo-software/component-styles/toggle';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Toggle } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Toggle {...args} aria-label='Перемешать'>
                <Icon name='shuffle' />
                {args.variant === 'labeled' ? 'Перемешать' : null}
            </Toggle>
        </div>
    );
}

const meta = {
    title: 'Actions/Toggle',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component:
                    'Переключатель (Figma "Toggle"): иконка 40×40 или пилюля с подписью. Включённое состояние — `data-pressed`: иконка и контур в цвете бренда.'
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
            <Section title='Иконка' description='Выключен, включён и недоступен; размеры 32 / 40 / 48.'>
                {(['small', 'medium', 'large'] as const).map((size) => (
                    <Row key={size} label={size}>
                        <Toggle size={size} aria-label='Перемешать'>
                            <Icon name='shuffle' />
                        </Toggle>
                        <Toggle size={size} defaultPressed={true} aria-label='Перемешать'>
                            <Icon name='shuffle' />
                        </Toggle>
                        <Toggle size={size} aria-label='В избранное'>
                            <Icon name='favorite' />
                        </Toggle>
                        <Toggle size={size} disabled={true} aria-label='Перемешать'>
                            <Icon name='shuffle' />
                        </Toggle>
                        <Toggle size={size} disabled={true} defaultPressed={true} aria-label='Перемешать'>
                            <Icon name='shuffle' />
                        </Toggle>
                    </Row>
                ))}
            </Section>
            <Section title='С подписью' description='Пилюля: выключенная — заливка, включённая — контур в цвете бренда.'>
                <Row label='off / on'>
                    <Toggle variant='labeled'>
                        <Icon name='shuffle' />
                        Off
                    </Toggle>
                    <Toggle variant='labeled' defaultPressed={true}>
                        <Icon name='shuffle' />
                        On
                    </Toggle>
                    <Toggle variant='labeled' defaultPressed={true}>
                        <Icon name='hint' />
                        Подсказки
                    </Toggle>
                </Row>
                <Row label='disabled'>
                    <Toggle variant='labeled' disabled={true}>
                        <Icon name='shuffle' />
                        Off
                    </Toggle>
                    <Toggle variant='labeled' disabled={true} defaultPressed={true}>
                        <Icon name='shuffle' />
                        On
                    </Toggle>
                </Row>
            </Section>
        </Page>
    )
};
