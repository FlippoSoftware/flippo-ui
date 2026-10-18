import { input as recipe } from '@flippo-software/component-styles/input';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, search, section, t, textInput, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const markup = search('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Input',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'input.descriptionWeb'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

function states(appearance: string): string {
    const attributes = `appearance="${appearance}"`;
    return (
        row('blank', search(attributes), { fill: true }) +
        row('filled', search(attributes, `default-value="${t('common.uxLaws')}"`), { fill: true }) +
        row('wrong', search(attributes, `default-value="${t('input.content.jakobSLa')}"`, 'aria-invalid="true"'), { fill: true }) +
        row('disabled', search(attributes, `default-value="${t('common.uxLaws')}" disabled`), { fill: true })
    );
}

export const Gallery: Story = {
    render: () =>
        page(
            section('Light', t('input.sections.light.description'), states('light')) +
                section('Inverted', t('input.sections.inverted.description'), states('inverted'), { raised: true }) +
                section(
                    t('input.sections.sizes.title'),
                    t('input.sections.sizes.description'),
                    (['large', 'medium', 'small'] as const)
                        .map((size) => row(size, search(`size="${size}"`, `default-value="${t('common.jakobSLaw')}"`), { fill: true }))
                        .join('')
                ) +
                section(
                    'Underline',
                    t('input.sections.underline.description'),
                    row(
                        'visible line',
                        textInput('appearance="underline"', `aria-label="${t('common.name')}"`, {
                            control: `default-value="${t('common.uxLawsExam')}"`
                        }),
                        { fill: true }
                    ) +
                        row(
                            'invisible line',
                            textInput('appearance="underline-invisible"', `aria-label="${t('common.name')}"`, {
                                control: `default-value="${t('common.uxLawsExam')}"`
                            }),
                            {
                                fill: true
                            }
                        ) +
                        row(
                            'blank',
                            textInput(
                                'appearance="underline"',
                                `aria-label="${t('common.name')}" placeholder="${t('input.placeholders.enterATitle')}"`
                            ),
                            {
                                fill: true
                            }
                        )
                )
        )
};
