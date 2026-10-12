import type * as React from 'react';

import { card as recipe } from '@flippo-software/component-styles/card';

import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, Button, Card, Icon, Progress } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Grid, Page, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

function SetCard(props: Props & { title: string; count: number; learned: number }): React.JSX.Element {
    const { title, count, learned, ...rest } = props;
    return (
        <Card.Root {...rest}>
            <Card.Content>
                <span className='sb-caption' style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fl-color-set)' }}>
                    <Icon name='set' />
                    {count} карточек
                </span>
                <Card.Title>{title}</Card.Title>
                <Progress.Root value={Math.round((learned / count) * 100)} aria-label='Выучено'>
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
            </Card.Content>
            <Card.Footer>
                <Avatar.Root size='x-small'>
                    <Avatar.Fallback>ЕГ</Avatar.Fallback>
                </Avatar.Root>
                <span className='sb-caption' style={{ flex: 1 }}>
                    {learned} из {count} выучено
                </span>
                <Button size='small'>Учить</Button>
            </Card.Footer>
        </Card.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example sb-narrow'>
            <Card.Root {...args}>
                <Card.Content>
                    <Card.Title>Совместная работа</Card.Title>
                    <Card.Description>Пригласите друзей в набор: каждый добавит свои карточки, а повторять будете вместе.</Card.Description>
                </Card.Content>
                <Card.Footer>
                    <Button>
                        <Icon name='person-add' />
                        Пригласить
                    </Button>
                    <Button variant='label'>Позже</Button>
                </Card.Footer>
            </Card.Root>
        </div>
    );
}

const meta = {
    title: 'Display/Card',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component:
                    'Карточка: поверхность `bg-1` с тонкой рамкой; блок содержимого и подвал с действиями. Рамка светлеет при наведении.'
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
            <Section title='Призыв к действию' description='Заголовок, описание и кнопки в подвале.'>
                <Example />
            </Section>
            <Section title='Сетка наборов' description='Одинаковые отступы и подвал прижат к низу при разной высоте заголовков.'>
                <Grid min={240}>
                    <SetCard title='Экзамен Законы UX' count={32} learned={20} />
                    <SetCard title='JavaScript: замыкания, контекст и прототипы' count={18} learned={4} />
                    <SetCard title='Английский B2' count={120} learned={120} />
                </Grid>
            </Section>
        </Page>
    )
};
