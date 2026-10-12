import { autocomplete as recipe } from '@flippo-software/component-styles/autocomplete';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { icon, page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const SETS = ['Экзамен Законы UX', 'Новый набор', 'C++', 'Английский B2', 'История искусств', 'Психология восприятия'];

function search(attributes = '', inputAttributes = ''): string {
    return `<demo-autocomplete ${attributes}>
<demo-autocomplete-input-group>
${icon('magnifier').replace('<svg', '<svg class="fl-combobox-icon"')}
<demo-autocomplete-input as-child><input aria-label="Поиск наборов" placeholder="Поиск наборов" ${inputAttributes}/></demo-autocomplete-input>
<demo-autocomplete-clear aria-label="Очистить"></demo-autocomplete-clear>
</demo-autocomplete-input-group>
<demo-autocomplete-positioner><demo-autocomplete-popup>
<demo-autocomplete-empty>Наборов не найдено</demo-autocomplete-empty>
<demo-autocomplete-list>${SETS.map((set) => `<demo-autocomplete-item value="${set}">${icon('set')}${set}</demo-autocomplete-item>`).join('')}</demo-autocomplete-list>
</demo-autocomplete-popup></demo-autocomplete-positioner>
</demo-autocomplete>`;
}

const markup = search('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Autocomplete',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Поиск с подсказками: значение поля — свободный текст, список предлагает варианты. Открывается при нажатии на поле и при вводе.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const medium = (html: string) => `<div class="sb-medium">${html}</div>`;

export const Gallery: Story = {
    render: () =>
        page(
            section(
                'Строка поиска',
                'Figma "Searchbar": лупа слева, крестик очистки появляется с текстом.',
                (['large', 'medium', 'small'] as const).map((size) => row(size, medium(search(`size="${size}"`)))).join('')
            ) +
                section(
                    'На карточке',
                    'Inverted и недоступное поле.',
                    row('inverted', medium(search('appearance="inverted"'))) +
                        row('disabled', medium(search('appearance="inverted" disabled', 'disabled'))),
                    { raised: true }
                )
        )
};
