import { switchRecipe as recipe } from '@flippo-software/component-styles/switch';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, page, renderExample, row, section, t, toggleSwitch, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; defaultChecked?: boolean };

const markup = () => toggleSwitch(t('common.shuffleTheCards'), 'data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Switch',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        defaultChecked: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: { component: 'switch.description' }
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
                t('switch.sections.statesAndSizes.title'),
                t('switch.sections.statesAndSizes.description'),
                (['small', 'medium', 'large'] as const)
                    .map((size) =>
                        row(
                            size,
                            toggleSwitch(t('switch.content.off'), `size="${size}"`, `size="${size}"`) +
                                toggleSwitch(t('switch.content.on'), `size="${size}" default-checked`, `size="${size}"`) +
                                toggleSwitch(t('common.disabled'), `size="${size}" disabled default-checked`, `size="${size}"`)
                        )
                    )
                    .join('')
            ) +
                section(
                    t('switch.sections.setSettings.title'),
                    t('switch.sections.setSettings.description'),
                    card(
                        `<div class="sb-items sb-items--column">${toggleSwitch(t('common.shuffleTheCards'), 'default-checked')}${toggleSwitch(t('common.showHints'))}${toggleSwitch(t('switch.content.reviewHardOnesMore'), 'default-checked')}</div>`
                    )
                )
        )
};
