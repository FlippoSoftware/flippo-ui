import { drawer as recipe } from '@flippo-software/component-styles/drawer';

import type { Meta, StoryObj } from '@storybook/web-components';

import { toggleSwitch } from './choice';
import { renderExample, variantControls } from './helpers';
import { icon, page, row, section, triggerButton } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { direction?: 'down' | 'up' | 'left' | 'right' };

function settings(attributes = '', label = 'Настройки повторения'): string {
    return `<demo-drawer ${attributes}>
<demo-drawer-trigger as-child>${triggerButton(`${icon('settings')}${label}`, { variant: 'secondary' })}</demo-drawer-trigger>
<demo-drawer-backdrop></demo-drawer-backdrop>
<demo-drawer-popup>
<demo-drawer-drag></demo-drawer-drag>
<demo-drawer-title>Настройки повторения</demo-drawer-title>
<demo-drawer-description>Потяните или нажмите Escape, чтобы закрыть.</demo-drawer-description>
<div class="sb-items sb-items--column">${toggleSwitch('Перемешивать карточки', 'default-checked')}${toggleSwitch('Показывать подсказки')}${toggleSwitch('Повторять сложные чаще', 'default-checked')}</div>
<demo-drawer-actions><demo-drawer-close as-child>${triggerButton('Готово')}</demo-drawer-close></demo-drawer-actions>
</demo-drawer-popup>
</demo-drawer>`;
}

const markup = settings('data-story-target');

const meta: Meta<Props> = {
    title: 'Overlays/Drawer',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        direction: { control: 'select', options: ['down', 'up', 'left', 'right'], table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'Выезжающая панель: снизу на телефоне или сбоку на компьютере; следует за жестом и закрывается свайпом.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () =>
        page(
            section(
                'Направления',
                'С какой стороны выезжает панель и куда её можно смахнуть.',
                row('down', settings('direction="down"', 'Снизу')) +
                    row('up', settings('direction="up"', 'Сверху')) +
                    row('right', settings('direction="right"', 'Справа')) +
                    row('left', settings('direction="left"', 'Слева'))
            )
        )
};
