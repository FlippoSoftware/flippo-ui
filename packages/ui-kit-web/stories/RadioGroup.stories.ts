import { radioGroup as recipe } from '@flippo-software/component-styles/radio-group';

import type { Meta, StoryObj } from '@storybook/web-components';

import { radio } from './choice';
import { renderExample, variantControls } from './helpers';
import { card, grid, page, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const ACCESS = [
    ['private', 'Только я'],
    ['link', 'Все, у кого есть ссылка'],
    ['public', 'Все в сообществе']
] as const;

function access(attributes = ''): string {
    return `<demo-radio-group ${attributes} default-value="link" aria-label="Доступ к набору">${ACCESS.map(([value, label]) => radio(value, label)).join('')}</demo-radio-group>`;
}

const markup = access('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/RadioGroup',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Группа радиокнопок: стрелки переключают выбор, значение — `value` выбранной.' }
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
                'Расположение',
                'Колонкой или в строку.',
                grid(
                    card(access(), 'vertical') +
                        card(access('orientation="horizontal"'), 'horizontal') +
                        card(access('disabled'), 'disabled'),
                    300
                )
            )
        )
};
