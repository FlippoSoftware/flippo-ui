import { avatar as recipe } from '@flippo-software/component-styles/avatar';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const PHOTO =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23545be8'/%3E%3Ccircle cx='40' cy='30' r='14' fill='%23fff'/%3E%3Cpath d='M12 80a28 28 0 0 1 56 0' fill='%23fff'/%3E%3C/svg%3E";

function person(attributes = '', options: { photo?: boolean; initials?: string } = {}): string {
    const { photo = false, initials = 'ЕГ' } = options;
    const image = photo ? `<demo-avatar-image as-child><img alt="Егор Горочкин" src="${PHOTO}"/></demo-avatar-image>` : '';
    return `<demo-avatar ${attributes}>${image}<demo-avatar-fallback>${initials}</demo-avatar-fallback></demo-avatar>`;
}

const SIZES = ['x-small', 'small', 'medium', 'large', 'x-large'];

const team = `<div style="display: flex; align-items: center">${(
    [
        ['ЕГ', true],
        ['НЗ', false],
        ['РШ', false],
        ['АК', true]
    ] as const
)
    .map(
        ([initials, photo], index) =>
            `<span style="margin-inline-start: ${index ? -8 : 0}px; border-radius: 50%; box-shadow: 0 0 0 2px var(--fl-color-bg-0); display: inline-flex">${person('size="small"', { photo, initials })}</span>`
    )
    .join('')}<span class="sb-caption" style="margin-inline-start: 8px">+2</span></div>`;

const markup = person('data-story-target', { photo: true });

const meta: Meta<Props> = {
    title: 'Display/Avatar',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Аватар: фото или инициалы, пока фото грузится или если его нет. Пять размеров, круг или квадрат.' }
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
                '',
                row('photo', SIZES.map((size) => person(`size="${size}"`, { photo: true })).join('')) +
                    row('initials', SIZES.map((size) => person(`size="${size}"`)).join(''))
            ) +
                section(
                    'Форма',
                    '',
                    row('circle', person('', { photo: true }) + person()) +
                        row('square', person('shape="square"', { photo: true }) + person('shape="square"'))
                ) +
                section('Участники', 'Стопка аватаров с перекрытием и счётчиком остальных.', team)
        )
};
