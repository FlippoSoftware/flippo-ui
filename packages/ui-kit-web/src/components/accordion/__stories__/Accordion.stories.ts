import { accordion as recipe } from '@flippo-software/component-styles/accordion';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { multiple?: boolean };

const LAWS = () =>
    [
        ['aesthetic', t('common.aestheticEffect'), t('accordion.content.usersPerceiveAnAesthetic')],
        ['proximity', t('common.lawOfProximity'), t('accordion.content.elementsCloseToEach')],
        ['jakob', t('common.jakobSLaw'), t('accordion.content.usersSpendMoreTime')],
        ['hick', t('common.hickSLaw'), t('accordion.content.theTimeToDecide')]
    ] as const;

function laws(attributes = '', open = 'aesthetic'): string {
    return `<demo-accordion ${attributes} default-value="${open}">${LAWS()
        .map(
            ([value, title, text]) =>
                `<demo-accordion-item value="${value}"><demo-accordion-header><demo-accordion-trigger as-child><button type="button">${title}<demo-accordion-icon></demo-accordion-icon></button></demo-accordion-trigger></demo-accordion-header><demo-accordion-panel><demo-accordion-content>${text}</demo-accordion-content></demo-accordion-panel></demo-accordion-item>`
        )
        .join('')}</demo-accordion>`;
}

const markup = laws('data-story-target');

const meta: Meta<Props> = {
    title: 'Disclosure/Accordion',
    args: {},
    argTypes: { ...variantControls(recipe), multiple: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'accordion.descriptionWeb'
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
                t('accordion.sections.oneOpenPanel.title'),
                t('accordion.sections.oneOpenPanel.description'),
                `<div class="sb-medium">${laws()}</div>`
            ) +
                section(
                    t('accordion.sections.severalPanels.title'),
                    t('accordion.sections.severalPanels.description'),
                    `<div class="sb-medium">${card(laws('multiple', 'aesthetic jakob'))}</div>`
                )
        )
};
