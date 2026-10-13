import { tooltip as recipe } from '@flippo-software/component-styles/tooltip';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, triggerButton, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function hint(name: IconName, text: string, attributes = '', side = ''): string {
    return `<demo-tooltip ${attributes}>
<demo-tooltip-trigger as-child>${triggerButton(icon(name), { variant: 'secondary', iconOnly: true }, `aria-label="${text}"`)}</demo-tooltip-trigger>
<demo-tooltip-positioner ${side ? `side="${side}"` : ''}><demo-tooltip-popup>${text}<demo-tooltip-arrow></demo-tooltip-arrow></demo-tooltip-popup></demo-tooltip-positioner>
</demo-tooltip>`;
}

const provider = (content: string) => `<demo-tooltip-provider>${content}</demo-tooltip-provider>`;

const markup = provider(hint('shuffle', 'Перемешать карточки', 'data-story-target'));

const meta: Meta<Props> = {
    title: 'Overlays/Tooltip',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Подсказка (Figma "Tooltip") при наведении и фокусе. Внутри `demo-tooltip-provider` соседние подсказки открываются сразу, без повторной задержки.'
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
                'Панель действий',
                'Проведите курсором по кнопкам: после первой подсказки остальные появляются без задержки.',
                provider(
                    row(
                        'toolbar',
                        hint('shuffle', 'Перемешать') +
                            hint('hint', 'Подсказка') +
                            hint('bookmark', 'В готовые') +
                            hint('delete', 'Удалить')
                    )
                )
            ) +
                section(
                    'Стороны',
                    'Сверху, снизу, слева и справа от триггера.',
                    provider(
                        row(
                            'side',
                            hint('chevron-up', 'Сверху', '', 'top') +
                                hint('chevron-down', 'Снизу', '', 'bottom') +
                                hint('chevron-left', 'Слева', '', 'left') +
                                hint('chevron-right', 'Справа', '', 'right')
                        )
                    )
                )
        )
};
