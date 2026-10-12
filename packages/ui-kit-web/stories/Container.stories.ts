import { container as recipe } from '@flippo-software/component-styles/container';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, resizable, resizableSection, row } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

const markup =
    '<demo-container data-story-target class="story-surface"><demo-text>Контейнер ограничивает ширину содержимого и центрирует его на странице.</demo-text></demo-container>';

const meta: Meta<Props> = {
    title: 'Layout/Container',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(resizable(markup), args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Колонка страницы: максимальная ширина по размеру `size` и боковые поля.' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () =>
        page(
            resizableSection(
                'Размеры',
                'Каждая полоса — контейнер своего размера.',
                ['xs', 'sm', 'md', 'lg']
                    .map((size) =>
                        row(
                            size,
                            `<demo-container size="${size}" class="story-surface"><demo-text size="body-minus">size="${size}"</demo-text></demo-container>`,
                            { fill: true }
                        )
                    )
                    .join('')
            )
        )
};
