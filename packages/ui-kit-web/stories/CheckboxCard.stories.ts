import { checkboxCard as recipe } from '@flippo-software/component-styles/checkbox-card';

import type { Meta, StoryObj } from '@storybook/web-components';

import { cardText } from './choice';
import { renderExample, variantControls } from './helpers';
import { grid, page, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; defaultChecked?: boolean };

function option(title: string, text: string, attributes = ''): string {
    return `<demo-checkbox-card ${attributes}><demo-checkbox-card-indicator></demo-checkbox-card-indicator>${cardText(title, text)}</demo-checkbox-card>`;
}

const markup = option('Подсказки', 'Показывать подсказку под вопросом', 'data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/CheckboxCard',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        defaultChecked: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Карточка-чекбокс: вся карточка переключает выбор. Индикатор всегда на месте (`keep-mounted`), меняется только галочка — раскладка не прыгает.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

/** `defaultValue` of a checkbox group is an array property. */
function setGroupValue(root: HTMLElement): void {
    for (const group of root.querySelectorAll<HTMLElement & { defaultValue?: string[] }>('demo-checkbox-group'))
        group.defaultValue = ['hints'];
}

export const Gallery: Story = {
    render: () =>
        page(
            section(
                'Положение индикатора',
                'В начале карточки или в конце, как переключатель настройки.',
                grid(
                    option('Подсказки', 'Показывать подсказку под вопросом', 'default-checked') +
                        option('Подробности', 'Блок с объяснением после ответа') +
                        option('Подсказки', 'Показывать подсказку под вопросом', 'indicator-position="end" default-checked') +
                        option('Подробности', 'Блок с объяснением после ответа', 'indicator-position="end"'),
                    300
                )
            ) +
                section(
                    'Недоступна',
                    'Выбор виден, но не меняется.',
                    grid(
                        option('Озвучка', 'Скоро будет доступно', 'disabled') +
                            option('Синхронизация', 'Включена администратором', 'disabled default-checked'),
                        300
                    )
                ) +
                section(
                    'Группа',
                    'Несколько карточек в `demo-checkbox-group`: значение — массив выбранных.',
                    `<demo-checkbox-group aria-label="Блоки карточки">${grid(
                        option('Подсказки', 'Под вопросом', 'value="hints"') +
                            option('Подробности', 'После ответа', 'value="details"') +
                            option('Изображение', 'Над вопросом', 'value="image"'),
                        240
                    )}</demo-checkbox-group>`
                ),
            setGroupValue
        )
};
