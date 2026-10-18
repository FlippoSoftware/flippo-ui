import { field as recipe } from '@flippo-software/component-styles/field';

import type { Meta, StoryObj } from '@storybook/web-components';

import { grid, page, renderExample, section, t, textInput, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; invalid?: boolean };

function titleField(
    fieldAttributes = '',
    inputAttributes = '',
    options: { value?: string; description?: string; input?: string } = {}
): string {
    const { value, description = t('field.content.visibleToEveryMember'), input = '' } = options;
    return `<demo-field name="title" ${fieldAttributes}>
<demo-field-label>${t('common.setName')}</demo-field-label>
${textInput(input, `placeholder="${t('field.placeholders.uxLawsSay')}"`, { control: `${value ? `default-value="${value}"` : ''} ${inputAttributes}` })}
<demo-field-description>${description}</demo-field-description>
<demo-field-error${fieldAttributes.includes('invalid') ? ' match="true"' : ''}>${t('field.content.theNameCannotBe')}</demo-field-error>
</demo-field>`;
}

const markup = titleField('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Field',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        invalid: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'field.descriptionWeb'
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
                t('field.sections.states.title'),
                t('field.sections.states.description'),
                grid(
                    titleField('', '', { value: t('common.uxLawsExam') }) +
                        titleField('invalid') +
                        titleField('disabled', 'disabled', {
                            value: t('common.uxLawsExam'),
                            description: t('field.content.onlyTheOwnerCan')
                        }),
                    300
                )
            ) +
                section(
                    t('field.sections.sizes.title'),
                    t('field.sections.sizes.descriptionWeb'),
                    grid(
                        titleField('', '', { value: 'Large', input: 'size="large"' }) +
                            titleField('', '', { value: 'Medium', input: 'size="medium"' }) +
                            titleField('', '', { value: 'Small', input: 'size="small"' }),
                        300
                    )
                ) +
                section(
                    t('field.sections.onACard.title'),
                    t('field.sections.onACard.description'),
                    grid(
                        titleField('', '', { input: 'appearance="inverted"' }) +
                            titleField('invalid', '', { input: 'appearance="inverted"' }),
                        300
                    ),
                    { raised: true }
                )
        )
};
