import type * as React from 'react';

import { scrollArea as recipe } from '@flippo-software/component-styles/scroll-area';

import type { Meta, StoryObj } from '@storybook/react';

import { ScrollArea, Text } from '~@src';
import { Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe>;

const CARDS = [
    'Закон Хика',
    'Закон Фиттса',
    'Закон Миллера',
    'Закон Якоба',
    'Закон Теслера',
    'Закон Паркинсона',
    'Закон Постела',
    'Эффект Зейгарник',
    'Эффект последовательности',
    'Эстетика-юзабилити',
    'Правило пика и конца',
    'Бритва Оккама'
];

function Vertical(props: Props): React.JSX.Element {
    return (
        <ScrollArea.Root {...props} style={{ blockSize: 240, inlineSize: 300 }}>
            <ScrollArea.Viewport>
                <ScrollArea.Content>
                    {CARDS.map((card, index) => (
                        <div key={card} style={{ display: 'flex', gap: 12, paddingBlock: 10, paddingInline: 16 }}>
                            <Text color='quaternary' style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {String(index + 1).padStart(2, '0')}
                            </Text>
                            <Text>{card}</Text>
                        </div>
                    ))}
                </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation='vertical'>
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Vertical {...args} />
        </div>
    );
}

const meta = {
    title: 'Layout/ScrollArea',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component:
                    'Область прокрутки с тонкими собственными полосами: появляются при наведении и прокрутке, не сдвигают содержимое.'
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
            <Section title='Вертикальная' description='Список карточек набора.'>
                <Row label='vertical'>
                    <Vertical />
                </Row>
            </Section>
            <Section
                title='Горизонтальная'
                description='Лента тем, прокрутка вбок: тачпадом, перетаскиванием полосы или колесом с зажатым Shift — как у нативной прокрутки.'
            >
                <ScrollArea.Root style={{ inlineSize: '100%', maxInlineSize: 520 }}>
                    <ScrollArea.Viewport>
                        <ScrollArea.Content style={{ display: 'flex', gap: 12, paddingBlockEnd: 14 }}>
                            {CARDS.map((card) => (
                                <div key={card} className='sb-card' style={{ flex: '0 0 160px' }}>
                                    <Text size='body-minus' weight='stronger'>
                                        {card}
                                    </Text>
                                </div>
                            ))}
                        </ScrollArea.Content>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar orientation='horizontal'>
                        <ScrollArea.Thumb />
                    </ScrollArea.Scrollbar>
                </ScrollArea.Root>
            </Section>
        </Page>
    )
};
