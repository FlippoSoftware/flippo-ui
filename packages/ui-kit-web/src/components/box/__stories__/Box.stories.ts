import { box as recipe } from '@flippo-software/component-styles/box';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, resizable, resizableSection, row, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { p?: string; width?: string };

const markup = '<demo-box data-story-target p="24px" class="story-surface">Блок с отступами и размерами из атрибутов.</demo-box>';

const meta: Meta<Props> = {
    title: 'Layout/Box',
    args: { p: '24px', width: '100%' },
    argTypes: { ...variantControls(recipe), p: { control: 'text' }, width: { control: 'text' } },
    render: (args: Props) => renderExample(resizable(markup), args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Базовый блок раскладки: отступы (`p`, `px`, `m`…), размеры (`width`, `max-width`…), позиция и overflow атрибутами.'
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
            resizableSection(
                'Отступы',
                '',
                ['8px', '16px', '32px'].map((p) => row(`p ${p}`, `<demo-box p="${p}" class="story-surface">Содержимое</demo-box>`)).join('')
            ) +
                resizableSection(
                    'Размеры',
                    '`max-width` ограничивает ширину, `width="100%"` растягивает.',
                    row(
                        'max-width 240',
                        '<demo-box p="12px" max-width="240px" class="story-surface">Не шире 240px, даже если места больше</demo-box>',
                        { fill: true }
                    )
                )
        )
};
