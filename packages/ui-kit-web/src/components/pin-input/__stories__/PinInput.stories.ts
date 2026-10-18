import { pinInput as recipe } from '@flippo-software/component-styles/pin-input';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function code(attributes = '', options: { length?: number; invalid?: boolean } = {}): string {
    const { length = 4, invalid = false } = options;
    const pins = Array.from(
        { length },
        (_, index) =>
            `<demo-pin-input-pin as-child><input aria-label="${t('pinInput.labels.digit', { number: index + 1 })}"${invalid ? ' aria-invalid="true"' : ''}/></demo-pin-input-pin>`
    ).join('');
    return `<div class="sb-items sb-items--column" style="align-items: flex-start"><demo-pin-input ${attributes}><demo-pin-input-group><demo-pin-input-focus-funnel>${pins}</demo-pin-input-focus-funnel></demo-pin-input-group></demo-pin-input><output aria-live="polite" class="sb-caption">${t('pinInput.content.enterTheCodeFrom')}</output></div>`;
}

/** Reports the complete code under each pin input. */
function reportComplete(root: HTMLElement): void {
    root.addEventListener('value-complete', (event) => {
        const output = (event.target as HTMLElement).parentElement?.querySelector('output');
        if (output) output.textContent = t('pinInput.content.codeEntered');
    });
}

const markup = code('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/PinInput',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args, reportComplete),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'pinInput.descriptionWeb'
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
                t('pinInput.sections.states.title'),
                t('pinInput.sections.states.description'),
                row('blank', code()) +
                    row('filled', code('default-value="4271"')) +
                    row('wrong', code('default-value="4271"', { invalid: true })) +
                    row('disabled', code('default-value="42" disabled'))
            ) +
                section(
                    t('pinInput.sections.sizes.title'),
                    t('pinInput.sections.sizes.description'),
                    row('large', code('size="large"', { length: 6 })) + row('medium', code('size="medium"', { length: 6 }))
                ) +
                section(
                    t('pinInput.sections.onACard.title'),
                    t('pinInput.sections.onACard.descriptionWeb'),
                    row('inverted', code('appearance="inverted" default-value="4271" mask')),
                    {
                        raised: true
                    }
                ),
            reportComplete
        )
};
