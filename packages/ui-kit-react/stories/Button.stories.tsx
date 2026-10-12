import type * as React from 'react';

import { button as recipe } from '@flippo-software/component-styles/button';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Card, Grid, Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe> & { disabled?: boolean };

const VARIANTS = ['primary', 'secondary', 'outlined', 'label', 'danger'] as const;
const SIZES = ['large', 'medium', 'small', 'x-small'] as const;

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Button {...args}>
                <Icon name='plus' />
                Создать набор
            </Button>
        </div>
    );
}

const meta = {
    title: 'Actions/Button',
    component: Example,
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    parameters: {
        docs: {
            description: {
                component:
                    'Кнопка (Figma "Button", "Icon Button"): CTA, Secondary, Outlined, Label и Danger; размеры 56 / 48 / 40 / 24. Иконки — дочерние `<svg>`, кнопка подгоняет их размер.'
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
            <Section title='Варианты' description='Основное действие экрана — primary; остальные варианты — по убыванию акцента.'>
                {VARIANTS.map((variant) => (
                    <Row key={variant} label={variant}>
                        <Button variant={variant}>
                            <Icon name='plus' />
                            Кнопка
                        </Button>
                        <Button variant={variant}>
                            Далее
                            <Icon name='chevron-right' />
                        </Button>
                        <Button variant={variant} iconOnly={true} aria-label='Добавить'>
                            <Icon name='plus' />
                        </Button>
                        <Button variant={variant} disabled={true}>
                            Недоступно
                        </Button>
                    </Row>
                ))}
            </Section>
            <Section
                title='Размеры'
                description='Large 56, Medium 48, Small 40, X-Small 24. Иконка-кнопка остаётся кругом того же размера.'
            >
                {SIZES.map((size) => (
                    <Row key={size} label={size}>
                        <Button size={size}>
                            <Icon name='plus' />
                            Создать набор
                        </Button>
                        <Button size={size} variant='secondary'>
                            Отмена
                        </Button>
                        <Button size={size} variant='secondary' iconOnly={true} aria-label='Настройки'>
                            <Icon name='settings' />
                        </Button>
                        <Button size={size} variant='label' iconOnly={true} aria-label='Ещё'>
                            <Icon name='dots-vertical' />
                        </Button>
                    </Row>
                ))}
            </Section>
            <Section title='Состояния' description='Загрузка блокирует повторное нажатие и показывает спиннер; ссылка выглядит как кнопка.'>
                <Row label='loading'>
                    <Button loading={true}>Сохраняю…</Button>
                    <Button variant='secondary' loading={true}>
                        Загрузка
                    </Button>
                </Row>
                <Row label='link'>
                    <Button href='#set' variant='outlined'>
                        Открыть набор
                        <Icon name='arrow-outward' />
                    </Button>
                </Row>
            </Section>
        </Page>
    )
};

export const Examples: Story = {
    render: () => (
        <Page>
            <Section title='В интерфейсе' description='Типичные сочетания кнопок из экранов Flippo.'>
                <Grid min={300}>
                    <Card caption='Пустая коллекция'>
                        <p className='sb-section-text'>У вас пока нет наборов. Создайте первый или загрузите из файла.</p>
                        <div className='sb-items'>
                            <Button>
                                <Icon name='plus' />
                                Создать набор
                            </Button>
                            <Button variant='outlined'>Загрузить</Button>
                        </div>
                    </Card>
                    <Card caption='Подтверждение'>
                        <p className='sb-section-text'>Удалить «Экзамен Законы UX» и 7 карточек?</p>
                        <div className='sb-items'>
                            <Button variant='label'>Отмена</Button>
                            <Button variant='danger'>
                                <Icon name='delete' />
                                Удалить
                            </Button>
                        </div>
                    </Card>
                    <Card caption='Панель карточки'>
                        <div className='sb-items'>
                            <Button size='small' variant='secondary'>
                                <Icon name='hint' />
                                Доб. подсказку
                            </Button>
                            <Button size='small' variant='secondary'>
                                <Icon name='bookmark' />В готовые
                            </Button>
                            <Button size='small' variant='label' iconOnly={true} aria-label='Ещё'>
                                <Icon name='dots-horizontal' />
                            </Button>
                        </div>
                    </Card>
                </Grid>
            </Section>
        </Page>
    )
};
