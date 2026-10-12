import { input as recipe } from '@flippo-software/component-styles/input';

import type { Meta, StoryObj } from '@storybook/web-components';

import { search, textInput } from './choice';
import { renderExample, variantControls } from './helpers';
import { page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const markup = search('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Input',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Поле ввода (Figma "Input Field", "Searchbar"): light — на странице, inverted — на карточке, underline — правка текста на месте. Нажатие в любом месте рамки фокусирует `<input>`. Значение и `disabled` — у `demo-input-control`; рамка следует за состоянием поля и `aria-invalid`.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

function states(appearance: string): string {
    const attributes = `appearance="${appearance}"`;
    return (
        row('blank', search(attributes), { fill: true }) +
        row('filled', search(attributes, 'default-value="Законы UX"'), { fill: true }) +
        row('wrong', search(attributes, 'default-value="Закон Яко"', 'aria-invalid="true"'), { fill: true }) +
        row('disabled', search(attributes, 'default-value="Законы UX" disabled'), { fill: true })
    );
}

export const Gallery: Story = {
    render: () =>
        page(
            section('Light', 'Поле на фоне страницы. Наведение подсвечивает рамку, фокус — цветом бренда.', states('light')) +
                section('Inverted', 'Поле на карточке (bg-1): темнее подложки, чтобы читалось.', states('inverted'), { raised: true }) +
                section(
                    'Размеры',
                    'Large 56 (Body), Medium 48 и Small 40 (Body–).',
                    (['large', 'medium', 'small'] as const)
                        .map((size) => row(size, search(`size="${size}"`, 'default-value="Закон Якоба"'), { fill: true }))
                        .join('')
                ) +
                section(
                    'Underline',
                    'Заголовок, который редактируют на месте: с линией или без неё до наведения.',
                    row(
                        'visible line',
                        textInput('appearance="underline"', 'aria-label="Название"', { control: 'default-value="Экзамен Законы UX"' }),
                        { fill: true }
                    ) +
                        row(
                            'invisible line',
                            textInput('appearance="underline-invisible"', 'aria-label="Название"', {
                                control: 'default-value="Экзамен Законы UX"'
                            }),
                            {
                                fill: true
                            }
                        ) +
                        row('blank', textInput('appearance="underline"', 'aria-label="Название" placeholder="Введи заголовок"'), {
                            fill: true
                        })
                )
        )
};
