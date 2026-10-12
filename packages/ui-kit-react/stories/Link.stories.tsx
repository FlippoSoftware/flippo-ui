import type * as React from 'react';

import { link as recipe } from '@flippo-software/component-styles/link';

import type { Meta, StoryObj } from '@storybook/react';

import { Icon, Link } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Card, Grid, Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Link {...args} href='#set'>
                <Icon name='plus' />
                Ссылка
                <Icon name='arrow-outward' />
            </Link>
        </div>
    );
}

const meta = {
    title: 'Actions/Link',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component:
                    'Ссылка (Figma "Link"): нейтральная и брендовая, с иконками до и после текста. Иконки — дочерние `<svg>` размером с текст.'
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
            <Section title='Варианты' description='Neutral — для второстепенных переходов, Branded — когда ссылка должна быть заметна.'>
                {(['neutral', 'branded'] as const).map((variant) => (
                    <Row key={variant} label={variant}>
                        <Link variant={variant} href='#set'>
                            Ссылка
                        </Link>
                        <Link variant={variant} href='#set'>
                            <Icon name='plus' />
                            Ссылка
                            <Icon name='arrow-outward' />
                        </Link>
                        <Link variant={variant} href='#set'>
                            <Icon name='arrow-back' />
                            Назад к коллекции
                        </Link>
                        <Link variant={variant} underline={true} href='#set'>
                            С подчёркиванием
                        </Link>
                    </Row>
                ))}
            </Section>
            <Section title='Размеры' description='Small (Body–) и Medium (Body); inherit берёт шрифт окружающего текста.'>
                <Row label='small'>
                    <Link size='small' href='#set'>
                        Открыть набор
                        <Icon name='arrow-outward' />
                    </Link>
                </Row>
                <Row label='medium'>
                    <Link size='medium' href='#set'>
                        Открыть набор
                        <Icon name='arrow-outward' />
                    </Link>
                </Row>
                <Row label='inherit'>
                    <p className='sb-section-text'>
                        Подробнее о законах UX читайте в{' '}
                        <Link size='inherit' variant='branded' underline={true} href='#guide'>
                            руководстве
                        </Link>
                        .
                    </p>
                </Row>
            </Section>
        </Page>
    )
};

export const Examples: Story = {
    render: () => (
        <Page>
            <Section title='В интерфейсе' description='Ссылки в навигации и в карточках.'>
                <Grid min={280}>
                    <Card caption='Навигация назад'>
                        <Link href='#collection'>
                            <Icon name='arrow-back' />
                            Коллекция
                        </Link>
                    </Card>
                    <Card caption='Внешний ресурс'>
                        <p className='sb-section-text'>Материалы курса доступны в открытом доступе.</p>
                        <Link variant='branded' href='#course'>
                            <Icon name='learn' />
                            Перейти к курсу
                            <Icon name='arrow-outward' />
                        </Link>
                    </Card>
                </Grid>
            </Section>
        </Page>
    )
};
