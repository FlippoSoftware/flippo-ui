import { strong as recipe } from '@flippo-software/component-styles/strong';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup =
    '<demo-text as-child><p>Внутри абзаца: <demo-strong data-story-target as-child><strong>выделенный фрагмент</strong></demo-strong> и обычный текст.</p></demo-text>';

const meta: Meta<Props> = {
    title: 'Typography/Strong',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: { source: { code: markup, language: 'html' }, description: { component: 'Важное в тексте: насыщенное начертание.' } }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const InText: Story = {
    render: () =>
        renderExample(
            '<div class="sb-medium"><demo-text as-child><p>Удалённый набор <demo-strong as-child><strong>нельзя восстановить</strong></demo-strong>.</p></demo-text></div>',
            {}
        )
};
