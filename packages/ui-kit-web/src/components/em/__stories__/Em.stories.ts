import { em as recipe } from '@flippo-software/component-styles/em';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup =
    '<demo-text as-child><p>Внутри абзаца: <demo-em data-story-target as-child><em>выделенный фрагмент</em></demo-em> и обычный текст.</p></demo-text>';

const meta: Meta<Props> = {
    title: 'Typography/Em',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: { docs: { source: { code: markup, language: 'html' }, description: { component: 'Логическое ударение: курсив.' } } }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const InText: Story = {
    render: () =>
        renderExample(
            '<div class="sb-medium"><demo-text as-child><p>Карточку нужно повторить <demo-em as-child><em>сегодня</em></demo-em>, иначе интервал собьётся.</p></demo-text></div>',
            {}
        )
};
