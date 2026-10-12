import { quote as recipe } from '@flippo-software/component-styles/quote';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

const markup =
    '<demo-text as-child><p>Внутри абзаца: <demo-quote data-story-target as-child><q>выделенный фрагмент</q></demo-quote> и обычный текст.</p></demo-text>';

const meta: Meta<Props> = {
    title: 'Typography/Quote',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Короткая цитата внутри текста: кавычки ставит браузер по языку страницы.' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const InText: Story = {
    render: () =>
        renderExample(
            '<div class="sb-medium"><demo-text as-child><p>Миллер писал о <demo-quote as-child><q>магическом числе семь плюс-минус два</q></demo-quote>.</p></demo-text></div>',
            {}
        )
};
