import { checkboxCard as recipe } from '@flippo-software/component-styles/checkbox-card';

import type { Meta, StoryObj } from '@storybook/web-components';

import { cardText, grid, page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; defaultChecked?: boolean };

function option(title: string, text: string, attributes = ''): string {
    return `<demo-checkbox-card ${attributes}><demo-checkbox-card-indicator></demo-checkbox-card-indicator>${cardText(title, text)}</demo-checkbox-card>`;
}

const markup = () => option(t('common.hints'), t('checkboxCard.content.showAHintUnder'), 'data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/CheckboxCard',
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
            description: {
                component: 'checkboxCard.descriptionWeb'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

/** `defaultValue` of a checkbox group is an array property. */
function setGroupValue(root: HTMLElement): void {
    for (const group of root.querySelectorAll<HTMLElement & { defaultValue?: string[] }>('demo-checkbox-group'))
        group.defaultValue = ['hints'];
}

export const Gallery: Story = {
    render: () =>
        page(
            section(
                t('checkboxCard.sections.indicatorPosition.title'),
                t('checkboxCard.sections.indicatorPosition.description'),
                grid(
                    option(t('common.hints'), t('checkboxCard.content.showAHintUnder'), 'default-checked') +
                        option(t('checkboxCard.content.details'), t('checkboxCard.content.anExplanationBlockAfter')) +
                        option(t('common.hints'), t('checkboxCard.content.showAHintUnder'), 'indicator-position="end" default-checked') +
                        option(
                            t('checkboxCard.content.details'),
                            t('checkboxCard.content.anExplanationBlockAfter'),
                            'indicator-position="end"'
                        ),
                    300
                )
            ) +
                section(
                    t('checkboxCard.sections.disabled.title'),
                    t('checkboxCard.sections.disabled.description'),
                    grid(
                        option(t('checkboxCard.content.voiceOver'), t('checkboxCard.content.comingSoon'), 'disabled') +
                            option(t('checkboxCard.content.sync'), t('checkboxCard.content.turnedOnByThe'), 'disabled default-checked'),
                        300
                    )
                ) +
                section(
                    t('checkboxCard.sections.group.title'),
                    t('checkboxCard.sections.group.descriptionWeb'),
                    `<demo-checkbox-group aria-label="${t('checkboxCard.labels.cardBlocks')}">${grid(
                        option(t('common.hints'), t('checkboxCard.content.belowTheQuestion'), 'value="hints"') +
                            option(t('checkboxCard.content.details'), t('checkboxCard.content.afterTheAnswer'), 'value="details"') +
                            option(t('checkboxCard.content.image'), t('checkboxCard.content.aboveTheQuestion'), 'value="image"'),
                        240
                    )}</demo-checkbox-group>`
                ),
            setGroupValue
        )
};
