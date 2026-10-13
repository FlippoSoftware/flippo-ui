import { grid as recipe } from '@flippo-software/component-styles/grid';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, resizable, resizableSection, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { columns?: number; spacing?: number };

const cell = (content: string, attributes = '') =>
    `<demo-grid-item ${attributes} p="12px" class="story-surface">${content}</demo-grid-item>`;

const markup = `<demo-grid data-story-target columns="3" spacing="3" width="100%">${['1', '2', '3', '4', '5', '6'].map((label) => cell(label)).join('')}</demo-grid>`;

const layout = `<demo-grid columns="4" spacing="2" width="100%">${cell('Шапка · col-span 4', 'col-span="4"')}${cell('Папки · row-span 2', 'row-span="2"')}${cell('Наборы · col-span 3', 'col-span="3"')}${cell('Активность · col-span 3', 'col-span="3"')}</demo-grid>`;

const adaptive = `<demo-grid columns="repeat(auto-fill, minmax(140px, 1fr))" spacing="2" width="100%">${Array.from({ length: 7 }, (_, index) => cell(`Набор ${index + 1}`)).join('')}</demo-grid>`;

const meta: Meta<Props> = {
    title: 'Layout/Grid',
    args: { columns: 3, spacing: 3 },
    argTypes: {
        ...variantControls(recipe),
        columns: { control: { type: 'range', min: 1, max: 6, step: 1 } },
        spacing: { control: { type: 'range', min: 0, max: 8, step: 1 } }
    },
    render: (args: Props) => renderExample(resizable(markup), args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Сетка: `columns` — число колонок или шаблон, `spacing` — шаг шкалы отступов. `demo-grid-item` занимает `col-span`/`row-span` ячеек.'
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
            resizableSection('Раскладка страницы', 'Шапка на всю ширину, боковая колонка и содержимое.', layout) +
                resizableSection('Адаптивные колонки', 'Шаблон `repeat(auto-fill, minmax(140px, 1fr))` — сколько поместится.', adaptive)
        )
};
