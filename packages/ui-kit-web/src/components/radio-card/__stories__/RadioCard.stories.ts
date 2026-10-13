import { radioCard as recipe } from '@flippo-software/component-styles/radio-card';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/web-components';

import { cardText, grid, icon, page, renderExample, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const MODES: [string, IconName, string, string][] = [
    ['all', 'set', 'Все карточки', 'По порядку набора'],
    ['shuffle', 'shuffle', 'Вперемешку', 'Случайный порядок'],
    ['hard', 'star', 'Сложные', 'Только отмеченные']
];

function modes(cardAttributes = '', groupAttributes = ''): string {
    return `<demo-radio-group ${groupAttributes} default-value="shuffle" aria-label="Режим повторения">${grid(
        MODES.map(
            ([value, name, title, text]) =>
                `<demo-radio-card value="${value}" ${cardAttributes}><demo-radio-card-indicator></demo-radio-card-indicator>${cardText(title, text, icon(name))}</demo-radio-card>`
        ).join(''),
        220
    )}</demo-radio-group>`;
}

const markup = modes('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/RadioCard',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Карточка-радиокнопка: выбор одного из вариантов с описанием, внутри `demo-radio-group`.' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () =>
        page(
            section('Индикатор в начале', 'По умолчанию.', modes()) +
                section('Индикатор в конце', 'Когда карточка начинается с иконки или заголовка.', modes('indicator-position="end"')) +
                section('Недоступна', 'Вся группа недоступна.', modes('', 'disabled'))
        )
};
