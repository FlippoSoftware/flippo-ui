import { scrollArea as recipe } from '@flippo-software/component-styles/scroll-area';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const CARDS = [
    'Закон Хика',
    'Закон Фиттса',
    'Закон Миллера',
    'Закон Якоба',
    'Закон Теслера',
    'Закон Паркинсона',
    'Закон Постела',
    'Эффект Зейгарник',
    'Эффект последовательности',
    'Эстетика-юзабилити',
    'Правило пика и конца',
    'Бритва Оккама'
];

const lines = CARDS.map(
    (card, index) =>
        `<div style="display: flex; gap: 12px; padding-block: 10px; padding-inline: 16px"><demo-text color="quaternary" style="font-variant-numeric: tabular-nums">${String(index + 1).padStart(2, '0')}</demo-text><demo-text>${card}</demo-text></div>`
).join('');

function vertical(attributes = ''): string {
    return `<demo-scroll-area ${attributes} style="block-size: 240px; inline-size: 300px"><demo-scroll-area-viewport><demo-scroll-area-content>${lines}</demo-scroll-area-content></demo-scroll-area-viewport><demo-scroll-area-scrollbar orientation="vertical"><demo-scroll-area-thumb></demo-scroll-area-thumb></demo-scroll-area-scrollbar></demo-scroll-area>`;
}

const horizontal = `<demo-scroll-area style="inline-size: 100%; max-inline-size: 520px"><demo-scroll-area-viewport><demo-scroll-area-content style="display: flex; gap: 12px; padding-block-end: 14px">${CARDS.map(
    (card) => `<div class="sb-card" style="flex: 0 0 160px"><demo-text size="body-minus" weight="stronger">${card}</demo-text></div>`
).join(
    ''
)}</demo-scroll-area-content></demo-scroll-area-viewport><demo-scroll-area-scrollbar orientation="horizontal"><demo-scroll-area-thumb></demo-scroll-area-thumb></demo-scroll-area-scrollbar></demo-scroll-area>`;

const markup = vertical('data-story-target');

const meta: Meta<Props> = {
    title: 'Layout/ScrollArea',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Область прокрутки с тонкими собственными полосами: появляются при наведении и прокрутке, не сдвигают содержимое.'
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
            section('Вертикальная', 'Список карточек набора.', row('vertical', vertical())) +
                section(
                    'Горизонтальная',
                    'Лента тем, прокрутка вбок: тачпадом, перетаскиванием полосы или колесом с зажатым Shift — как у нативной прокрутки.',
                    horizontal
                )
        )
};
