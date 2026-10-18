import { card as recipe } from '@flippo-software/component-styles/card';

import type { Meta, StoryObj } from '@storybook/web-components';

import { button, grid, icon, page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function invite(attributes = ''): string {
    return `<demo-card ${attributes}>
<demo-card-content>
<demo-card-title as-child><h3>${t('card.content.collaboration')}</h3></demo-card-title>
<demo-card-description as-child><p>${t('card.content.inviteFriendsToThe')}</p></demo-card-description>
</demo-card-content>
<demo-card-footer>${button(`${icon('person-add')}${t('common.invite')}`)}${button(t('card.content.later'), 'variant="label"')}</demo-card-footer>
</demo-card>`;
}

function setCard(title: string, count: number, learned: number): string {
    return `<demo-card>
<demo-card-content>
<span class="sb-caption" style="display: flex; align-items: center; gap: 6px; color: var(--fl-color-set)">${icon('set')}${count} ${t('card.content.cards')}</span>
<demo-card-title as-child><h3>${title}</h3></demo-card-title>
<demo-progress value="${Math.round((learned / count) * 100)}" aria-label="${t('card.labels.learned')}"><demo-progress-track><demo-progress-indicator></demo-progress-indicator></demo-progress-track></demo-progress>
</demo-card-content>
<demo-card-footer>
<demo-avatar size="x-small"><demo-avatar-fallback>${t('common.eg')}</demo-avatar-fallback></demo-avatar>
<span class="sb-caption" style="flex: 1">${learned} ${t('card.content.of')} ${count} ${t('card.content.learned')}</span>
${button(t('card.content.study'), 'size="small"')}
</demo-card-footer>
</demo-card>`;
}

const markup = invite('data-story-target');

const meta: Meta<Props> = {
    title: 'Display/Card',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(`<div class="sb-narrow">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'card.descriptionWeb'
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
                t('card.sections.callToAction.title'),
                t('card.sections.callToAction.description'),
                `<div class="sb-narrow">${invite()}</div>`
            ) +
                section(
                    t('card.sections.gridOfSets.title'),
                    t('card.sections.gridOfSets.description'),
                    grid(
                        setCard(t('common.uxLawsExam'), 32, 20) +
                            setCard(t('card.content.javascriptClosuresContextAnd'), 18, 4) +
                            setCard(t('common.englishB2'), 120, 120),
                        240
                    )
                )
        )
};
