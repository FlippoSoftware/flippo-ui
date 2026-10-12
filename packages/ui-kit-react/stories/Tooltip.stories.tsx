import type * as React from 'react';

import { tooltip as recipe } from '@flippo-software/component-styles/tooltip';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button, Icon, Tooltip } from '../src';

import type { RecipeVariants } from '../src/lib/Styled';

import { variantControls } from './controls';
import { Page, Row, Section } from './kit';

type Props = RecipeVariants<typeof recipe>;

function Hint(props: Props & { icon: IconName; text: string; side?: 'top' | 'bottom' | 'left' | 'right' }): React.JSX.Element {
    const { icon, text, side, ...rest } = props;
    return (
        <Tooltip.Root {...rest}>
            <Tooltip.Trigger render={<Button variant='secondary' iconOnly={true} aria-label={text} />}>
                <Icon name={icon} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Positioner side={side}>
                    <Tooltip.Popup>
                        {text}
                        <Tooltip.Arrow />
                    </Tooltip.Popup>
                </Tooltip.Positioner>
            </Tooltip.Portal>
        </Tooltip.Root>
    );
}

function Example(args: Props): React.JSX.Element {
    return (
        <div className='story-example'>
            <Tooltip.Provider>
                <Hint {...args} icon='shuffle' text='Перемешать карточки' />
            </Tooltip.Provider>
        </div>
    );
}

const meta = {
    title: 'Overlays/Tooltip',
    component: Example,
    args: {},
    argTypes: variantControls(recipe),
    parameters: {
        docs: {
            description: {
                component:
                    'Подсказка (Figma "Tooltip") при наведении и фокусе. Внутри `Tooltip.Provider` соседние подсказки открываются сразу, без повторной задержки.'
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
            <Section
                title='Панель действий'
                description='Проведите курсором по кнопкам: после первой подсказки остальные появляются без задержки.'
            >
                <Tooltip.Provider>
                    <Row label='toolbar'>
                        <Hint icon='shuffle' text='Перемешать' />
                        <Hint icon='hint' text='Подсказка' />
                        <Hint icon='bookmark' text='В готовые' />
                        <Hint icon='delete' text='Удалить' />
                    </Row>
                </Tooltip.Provider>
            </Section>
            <Section title='Стороны' description='Сверху, снизу, слева и справа от триггера.'>
                <Tooltip.Provider>
                    <Row label='side'>
                        <Hint icon='chevron-up' text='Сверху' side='top' />
                        <Hint icon='chevron-down' text='Снизу' side='bottom' />
                        <Hint icon='chevron-left' text='Слева' side='left' />
                        <Hint icon='chevron-right' text='Справа' side='right' />
                    </Row>
                </Tooltip.Provider>
            </Section>
        </Page>
    )
};
