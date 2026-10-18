import { radioCard as recipe } from '@flippo-software/component-styles/radio-card';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/web-components';

import { cardText, grid, icon, page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const MODES = (): [string, IconName, string, string][] => [
    ['all', 'set', t('common.allCards'), t('radioCard.content.inSetOrder')],
    ['shuffle', 'shuffle', t('radioCard.content.shuffled'), t('radioCard.content.randomOrder')],
    ['hard', 'star', t('common.hardOnes'), t('radioCard.content.onlyMarkedOnes')]
];

function modes(cardAttributes = '', groupAttributes = ''): string {
    return `<demo-radio-group ${groupAttributes} default-value="shuffle" aria-label="${t('common.reviewMode')}">${grid(
        MODES()
            .map(
                ([value, name, title, text]) =>
                    `<demo-radio-card value="${value}" ${cardAttributes}><demo-radio-card-indicator></demo-radio-card-indicator>${cardText(title, text, icon(name))}</demo-radio-card>`
            )
            .join(''),
        220
    )}</demo-radio-group>`;
}

const markup = modes('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/RadioCard',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'radioCard.descriptionWeb' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () =>
        page(
            section(t('radioCard.sections.indicatorAtTheStart.title'), t('radioCard.sections.indicatorAtTheStart.description'), modes()) +
                section(
                    t('radioCard.sections.indicatorAtTheEnd.title'),
                    t('radioCard.sections.indicatorAtTheEnd.description'),
                    modes('indicator-position="end"')
                ) +
                section(t('radioCard.sections.disabled.title'), t('radioCard.sections.disabled.description'), modes('', 'disabled'))
        )
};
