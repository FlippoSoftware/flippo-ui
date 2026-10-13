import type * as React from 'react';

import { skeletonText as recipe } from '@flippo-software/component-styles/skeleton-text';

import type { Meta, StoryObj } from '@storybook/react';

import { SkeletonText } from '~@src';
import { Page, Row, Section, variantControls } from '~@stories';

import type { RecipeVariants } from '~@stories';

type Props = RecipeVariants<typeof recipe> & { lines?: number };

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example sb-medium'>
            <SkeletonText {...args} />
        </div>
    );
}

const meta = {
    title: 'Feedback/SkeletonText',
    component: Example,
    args: { lines: 3 },
    argTypes: { ...variantControls(recipe), lines: { control: { type: 'range', min: 1, max: 10, step: 1 } } },
    parameters: {
        docs: {
            description: {
                component:
                    'Заглушка абзаца. Строки занимают ровно высоту строки текущего шрифта (`1lh`), а полоса — 0.7em: подставьте заглушку в любой стиль текста, и при загрузке макет не сдвинется. Последняя строка короче.'
            }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const STYLES = [
    ['fl-text-heading-3-default', 'Экзамен Законы UX'],
    ['fl-text-body-default', 'Закон Хика: время принятия решения растёт с числом и сложностью вариантов выбора.'],
    ['fl-text-body-minus-default', 'Создано 12 октября · 32 карточки']
] as const;

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section
                title='Подстраивается под шрифт'
                description='Слева — заглушка в стиле текста, справа — сам текст. Высота блоков совпадает.'
            >
                {STYLES.map(([className, text]) => (
                    <Row key={className} label={className.replace('fl-text-', '')}>
                        <div
                            className={className}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, inlineSize: '100%', alignItems: 'start' }}
                        >
                            <SkeletonText lines={className.includes('body-default') ? 3 : 1} />
                            <span>{text}</span>
                        </div>
                    </Row>
                ))}
            </Section>
            <Section title='Анимация'>
                {(['pulse', 'shimmer', 'none'] as const).map((animation) => (
                    <Row key={animation} label={animation} fill={true}>
                        <SkeletonText lines={3} animation={animation} />
                    </Row>
                ))}
            </Section>
        </Page>
    )
};
