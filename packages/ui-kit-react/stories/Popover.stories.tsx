import type * as React from 'react';

import { popover as recipe } from '@flippo-software/component-styles/popover';

import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, Button, Icon, Popover } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

const PEOPLE = [
    ['ЕГ', 'Егор Горочкин', 'Владелец'],
    ['НЗ', 'Настя Завалова', '3 карточки'],
    ['РШ', 'Роберт Шумелов', '1 карточка']
] as const;

function Participants(props: Props & { side?: 'top' | 'bottom' | 'left' | 'right' }): React.JSX.Element {
    const { side, ...rest } = props;
    return (
        <Popover.Root {...rest}>
            <Popover.Trigger render={<Button variant='secondary' />}>
                <Icon name='person-add' />6 участников
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner side={side}>
                    <Popover.Popup>
                        <Popover.Arrow />
                        <Popover.Title>Участники набора</Popover.Title>
                        <Popover.Description>3 из 7 карточек назначено.</Popover.Description>
                        <div className='sb-items sb-items--column' style={{ gap: 10, marginBlock: 6 }}>
                            {PEOPLE.map(([initials, name, note]) => (
                                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Avatar.Root size='small'>
                                        <Avatar.Fallback>{initials}</Avatar.Fallback>
                                    </Avatar.Root>
                                    <span style={{ display: 'grid' }}>
                                        <span style={{ color: 'var(--fl-color-text-primary)' }}>{name}</span>
                                        <span className='sb-caption'>{note}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Button size='small'>
                            <Icon name='person-add' />
                            Пригласить
                        </Button>
                        <Popover.Close aria-label='Закрыть' />
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Participants {...args} />
        </div>
    );
}

const meta = {
    title: 'Overlays/Popover',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: { component: 'Всплывающая карточка у триггера: заголовок, описание, произвольное содержимое и крестик закрытия.' }
        }
    }
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => (
        <Page>
            <Section title='Стороны' description='Попап со стрелкой с любой стороны триггера; у края окна переворачивается.'>
                <Row label='side'>
                    <Participants side='bottom' />
                    <Participants side='top' />
                    <Participants side='right' />
                </Row>
            </Section>
        </Page>
    )
};
