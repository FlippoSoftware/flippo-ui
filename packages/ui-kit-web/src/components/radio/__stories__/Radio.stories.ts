import { radio as recipe } from '@flippo-software/component-styles/radio';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, radio, renderExample, row, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const OPTIONS = [
    ['all', 'Все карточки'],
    ['new', 'Только новые'],
    ['hard', 'Сложные']
] as const;

function options(attributes = '', labelAttributes = ''): string {
    return `<demo-radio-group default-value="all" orientation="horizontal" aria-label="Режим повторения">${OPTIONS.map(([value, label]) => radio(value, label, attributes, labelAttributes)).join('')}</demo-radio-group>`;
}

const markup = options('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Radio',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Радиокнопка: круг 20px, выбранная заливается цветом бренда с белой точкой. Используется внутри `demo-radio-group`.'
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
                'Размеры',
                '16, 20 и 24px.',
                (['small', 'medium', 'large'] as const).map((size) => row(size, options(`size="${size}"`, `size="${size}"`))).join('')
            ) + section('Недоступна', 'Недоступную радиокнопку видно, но выбрать нельзя.', row('disabled', options('disabled')))
        )
};
