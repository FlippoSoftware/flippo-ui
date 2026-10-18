import { drawer as recipe } from '@flippo-software/component-styles/drawer';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, t, toggleSwitch, triggerButton, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { direction?: 'down' | 'up' | 'left' | 'right' };

function settings(attributes = '', label = t('drawer.content.reviewSettings')): string {
    return `<demo-drawer ${attributes}>
<demo-drawer-trigger as-child>${triggerButton(`${icon('settings')}${label}`, { variant: 'secondary' })}</demo-drawer-trigger>
<demo-drawer-backdrop></demo-drawer-backdrop>
<demo-drawer-popup>
<demo-drawer-drag></demo-drawer-drag>
<demo-drawer-title>${t('drawer.content.reviewSettings')}</demo-drawer-title>
<demo-drawer-description>${t('drawer.content.pullOrPressEscape')}</demo-drawer-description>
<div class="sb-items sb-items--column">${toggleSwitch(t('common.shuffleTheCards'), 'default-checked')}${toggleSwitch(t('common.showHints'))}${toggleSwitch(t('drawer.content.reviewHardOnesMore'), 'default-checked')}</div>
<demo-drawer-actions><demo-drawer-close as-child>${triggerButton(t('drawer.content.done'))}</demo-drawer-close></demo-drawer-actions>
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
                component: 'drawer.description'
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
                t('drawer.sections.directions.title'),
                t('drawer.sections.directions.description'),
                row('down', settings('direction="down"', t('common.bottom'))) +
                    row('up', settings('direction="up"', t('common.top'))) +
                    row('right', settings('direction="right"', t('common.right'))) +
                    row('left', settings('direction="left"', t('common.left')))
            )
        )
};
