import { checkbox as recipe } from '@flippo-software/component-styles/checkbox';

import type { Meta, StoryObj } from '@storybook/web-components';

import { checkbox, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; defaultChecked?: boolean; indeterminate?: boolean };

const markup = () => checkbox(t('common.shuffleTheCards'), 'data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Checkbox',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        defaultChecked: { control: 'boolean', table: { category: 'Behaviour' } },
        indeterminate: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: {
                component: 'checkbox.descriptionWeb'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

function states(attributes: string, labelAttributes = ''): string {
    return (
        checkbox(t('checkbox.content.unchecked'), attributes, labelAttributes) +
        checkbox(t('checkbox.content.checked'), `${attributes} default-checked`, labelAttributes) +
        checkbox(t('checkbox.content.partly'), `${attributes} indeterminate`, labelAttributes)
    );
}

export const Gallery: Story = {
    render: () =>
        page(
            section(
                t('checkbox.sections.states.title'),
                t('checkbox.sections.states.description'),
                row('enabled', states('')) + row('disabled', states('disabled'))
            ) +
                section(
                    t('checkbox.sections.sizes.title'),
                    t('checkbox.sections.sizes.description'),
                    (['small', 'medium', 'large'] as const).map((size) => row(size, states(`size="${size}"`, `size="${size}"`))).join('')
                )
        )
};
