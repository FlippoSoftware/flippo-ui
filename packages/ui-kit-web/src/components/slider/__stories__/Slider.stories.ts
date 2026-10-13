import { slider as recipe } from '@flippo-software/component-styles/slider';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, grid, page, renderExample, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function daily(attributes = '', options: { label?: string; value?: string } = {}): string {
    const { label = 'Карточек в день', value = '40' } = options;
    const range = value.includes(' ');
    const thumbs = range
        ? '<demo-slider-thumb aria-label="От"></demo-slider-thumb><demo-slider-thumb aria-label="До"></demo-slider-thumb>'
        : `<demo-slider-thumb aria-label="${label}"></demo-slider-thumb>`;
    return `<demo-slider ${attributes} default-value="${value}" min="0" max="100">
<div class="sb-items" style="justify-content: space-between"><span class="sb-caption">${label}</span><demo-slider-value></demo-slider-value></div>
<demo-slider-control><demo-slider-track><demo-slider-indicator></demo-slider-indicator>${thumbs}</demo-slider-track></demo-slider-control>
</demo-slider>`;
}

const markup = daily('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Slider',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(`<div class="sb-narrow">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Ползунок: одно значение или диапазон из двух бегунков (`default-value="20 70"`); стрелки клавиатуры двигают бегунок.'
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
                'Значение и диапазон',
                'Один бегунок или два для диапазона.',
                grid(
                    card(daily()) +
                        card(daily('', { label: 'Сложность', value: '20 70' })) +
                        card(daily('disabled', { label: 'Недоступен' })),
                    300
                )
            )
        )
};
