import { combobox as recipe } from '@flippo-software/component-styles/combobox';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const LAWS = () => [
    t('common.jakobSLaw'),
    t('common.fittsSLaw'),
    t('common.hickSLaw'),
    t('common.lawOfProximity'),
    t('common.millerSLaw'),
    t('common.aestheticEffect'),
    t('common.teslerSLaw')
];

const popup = () => `<demo-combobox-positioner><demo-combobox-popup>
<demo-combobox-empty>${t('combobox.content.nothingFound')}</demo-combobox-empty>
<demo-combobox-list>${LAWS()
    .map(
        (law) =>
            `<demo-combobox-item value="${law}">${law}<demo-combobox-item-indicator></demo-combobox-item-indicator></demo-combobox-item>`
    )
    .join('')}</demo-combobox-list>
</demo-combobox-popup></demo-combobox-positioner>`;

function laws(attributes = '', inputAttributes = ''): string {
    return `<demo-combobox ${attributes}>
<demo-combobox-input-group>
<demo-combobox-input as-child><input aria-label="${t('combobox.labels.law')}" placeholder="${t('combobox.placeholders.findALaw')}" ${inputAttributes}/></demo-combobox-input>
<demo-combobox-clear aria-label="${t('common.clear')}"></demo-combobox-clear>
<demo-combobox-trigger aria-label="${t('combobox.labels.showTheLaws')}"></demo-combobox-trigger>
</demo-combobox-input-group>
${popup()}
</demo-combobox>`;
}

const chips = () => `<demo-combobox multiple chips data-default-values>
<demo-combobox-input-group>
<demo-combobox-chips>
<template><demo-combobox-chip><demo-combobox-chip-label></demo-combobox-chip-label><demo-combobox-chip-remove aria-label="${t('combobox.labels.remove')}"></demo-combobox-chip-remove></demo-combobox-chip></template>
<demo-combobox-input as-child><input aria-label="${t('combobox.labels.laws')}" placeholder="${t('combobox.placeholders.addALaw')}"/></demo-combobox-input>
</demo-combobox-chips>
<demo-combobox-clear aria-label="${t('common.clear')}"></demo-combobox-clear>
<demo-combobox-trigger aria-label="${t('combobox.labels.showTheLaws')}"></demo-combobox-trigger>
</demo-combobox-input-group>
${popup()}
</demo-combobox>`;

/** `items` (the values the input text and the chips come from) and the values of a `multiple` combobox are array properties. */
function setValues(root: HTMLElement): void {
    for (const combobox of root.querySelectorAll<HTMLElement & { items?: string[]; defaultValue?: unknown }>('demo-combobox')) {
        combobox.items = LAWS();
        if (combobox.hasAttribute('data-default-values')) combobox.defaultValue = [t('common.jakobSLaw'), t('common.hickSLaw')];
    }
}

const markup = laws('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Combobox',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args, setValues),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'combobox.descriptionWeb'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const medium = (html: string) => `<div class="sb-medium">${html}</div>`;

export const Gallery: Story = {
    render: () =>
        page(
            section(
                t('combobox.sections.sizes.title'),
                t('combobox.sections.sizes.description'),
                (['large', 'medium', 'small'] as const).map((size) => row(size, medium(laws(`size="${size}"`)))).join('')
            ) +
                section(t('combobox.sections.severalValues.title'), t('combobox.sections.severalValues.description'), medium(chips())) +
                section(
                    t('combobox.sections.onACard.title'),
                    t('combobox.sections.onACard.description'),
                    row('inverted', medium(laws(`appearance="inverted" default-value="${t('common.fittsSLaw')}"`))) +
                        row(
                            'disabled',
                            medium(laws(`appearance="inverted" disabled default-value="${t('common.fittsSLaw')}"`, 'disabled'))
                        ),
                    { raised: true }
                ),
            setValues
        )
};
