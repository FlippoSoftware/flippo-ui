import { toggle as recipe } from '@flippo-software/component-styles/toggle';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { icon, page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; defaultPressed?: boolean };

function toggle(content: string, attributes = '', label = ''): string {
    return `<demo-toggle ${attributes} as-child><button type="button"${label ? ` aria-label="${label}"` : ''}>${content}</button></demo-toggle>`;
}

const markup = `<demo-toggle data-story-target as-child>
<button type="button" aria-label="Перемешать">${icon('shuffle')}</button>
</demo-toggle>`;

const meta: Meta<Props> = {
    title: 'Actions/Toggle',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        defaultPressed: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Переключатель (Figma "Toggle"): иконка 40×40 или пилюля с подписью. Включённое состояние — `data-pressed`: иконка и контур в цвете бренда.'
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
                'Иконка',
                'Выключен, включён и недоступен; размеры 32 / 40 / 48.',
                (['small', 'medium', 'large'] as const)
                    .map((size) =>
                        row(
                            size,
                            toggle(icon('shuffle'), `size="${size}"`, 'Перемешать') +
                                toggle(icon('shuffle'), `size="${size}" default-pressed`, 'Перемешать') +
                                toggle(icon('favorite'), `size="${size}"`, 'В избранное') +
                                toggle(icon('shuffle'), `size="${size}" disabled`, 'Перемешать') +
                                toggle(icon('shuffle'), `size="${size}" disabled default-pressed`, 'Перемешать')
                        )
                    )
                    .join('')
            ) +
                section(
                    'С подписью',
                    'Пилюля: выключенная — заливка, включённая — контур в цвете бренда.',
                    row(
                        'off / on',
                        toggle(`${icon('shuffle')}Off`, 'variant="labeled"') +
                            toggle(`${icon('shuffle')}On`, 'variant="labeled" default-pressed') +
                            toggle(`${icon('hint')}Подсказки`, 'variant="labeled" default-pressed')
                    ) +
                        row(
                            'disabled',
                            toggle(`${icon('shuffle')}Off`, 'variant="labeled" disabled') +
                                toggle(`${icon('shuffle')}On`, 'variant="labeled" disabled default-pressed')
                        )
                )
        )
};
