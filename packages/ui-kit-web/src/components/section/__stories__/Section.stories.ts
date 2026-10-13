import { section as recipe } from '@flippo-software/component-styles/section';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, resizable, resizableSection, row, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup =
    '<demo-section data-story-target class="story-surface"><demo-text size="heading-3">Мои наборы</demo-text><demo-text color="tertiary">Вертикальные отступы секции берутся из общей шкалы.</demo-text></demo-section>';

const meta: Meta<Props> = {
    title: 'Layout/Section',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(resizable(markup), args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Секция страницы: вертикальные отступы sm–xl между крупными блоками.' }
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
                'Высота полосы — отступы секции.',
                ['sm', 'md', 'lg', 'xl']
                    .map((size) =>
                        row(
                            size,
                            `<demo-section size="${size}" class="story-surface"><demo-text size="body-minus">size="${size}"</demo-text></demo-section>`,
                            { fill: true }
                        )
                    )
                    .join('')
            )
        )
};
