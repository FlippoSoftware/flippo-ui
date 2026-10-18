import { numberField as recipe } from '@flippo-software/component-styles/number-field';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function count(attributes = '', value = 10): string {
    return `<demo-number-field ${attributes} default-value="${value}" min="1" max="50">
<demo-number-field-group>
<demo-number-field-decrement aria-label="${t('numberField.labels.fewer')}"></demo-number-field-decrement>
<demo-number-field-input as-child><input aria-label="${t('numberField.labels.cardsAtATime')}"/></demo-number-field-input>
<demo-number-field-increment aria-label="${t('numberField.labels.more')}"></demo-number-field-increment>
</demo-number-field-group>
</demo-number-field>`;
}

const markup = count('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/NumberField',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'numberField.description'
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
                t('numberField.sections.sizes.title'),
                t('numberField.sections.sizes.description'),
                (['large', 'medium', 'small'] as const).map((size) => row(size, count(`size="${size}"`))).join('')
            ) +
                section(
                    t('numberField.sections.lookAndStates.title'),
                    t('numberField.sections.lookAndStates.description'),
                    row('inverted', count('appearance="inverted"')) +
                        row('at min', count('appearance="inverted"', 1)) +
                        row('disabled', count('appearance="inverted" disabled')),
                    { raised: true }
                )
        )
};
