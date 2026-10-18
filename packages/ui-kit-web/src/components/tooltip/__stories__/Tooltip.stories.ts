import { tooltip as recipe } from '@flippo-software/component-styles/tooltip';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, t, triggerButton, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function hint(name: IconName, text: string, attributes = '', side = ''): string {
    return `<demo-tooltip ${attributes}>
<demo-tooltip-trigger as-child>${triggerButton(icon(name), { variant: 'secondary', iconOnly: true }, `aria-label="${text}"`)}</demo-tooltip-trigger>
<demo-tooltip-positioner ${side ? `side="${side}"` : ''}><demo-tooltip-popup>${text}<demo-tooltip-arrow></demo-tooltip-arrow></demo-tooltip-popup></demo-tooltip-positioner>
</demo-tooltip>`;
}

const provider = (content: string) => `<demo-tooltip-provider>${content}</demo-tooltip-provider>`;

const markup = () => provider(hint('shuffle', t('tooltip.content.shuffleCards'), 'data-story-target'));

const meta: Meta<Props> = {
    title: 'Overlays/Tooltip',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: {
                component: 'tooltip.descriptionWeb'
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
                t('tooltip.sections.actionBar.title'),
                t('tooltip.sections.actionBar.description'),
                provider(
                    row(
                        'toolbar',
                        hint('shuffle', t('common.shuffle')) +
                            hint('hint', t('common.hint')) +
                            hint('bookmark', t('common.markAsDone')) +
                            hint('delete', t('common.delete'))
                    )
                )
            ) +
                section(
                    t('tooltip.sections.sides.title'),
                    t('tooltip.sections.sides.description'),
                    provider(
                        row(
                            'side',
                            hint('chevron-up', t('common.top'), '', 'top') +
                                hint('chevron-down', t('common.bottom'), '', 'bottom') +
                                hint('chevron-left', t('common.left'), '', 'left') +
                                hint('chevron-right', t('common.right'), '', 'right')
                        )
                    )
                )
        )
};
