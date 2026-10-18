import { collapsible as recipe } from '@flippo-software/component-styles/collapsible';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, grid, icon, page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; defaultOpen?: boolean };

function hint(attributes = ''): string {
    const disabled = attributes.includes('disabled') ? ' disabled' : '';
    return `<demo-collapsible ${attributes}>
<demo-collapsible-trigger as-child><button type="button"${disabled}><span style="display: inline-flex; align-items: center; gap: 8px">${icon('hint')}${t('common.hint')}</span><demo-collapsible-icon></demo-collapsible-icon></button></demo-collapsible-trigger>
<demo-collapsible-panel><demo-collapsible-content>${t('collapsible.content.rememberTheHitachiAtm')}</demo-collapsible-content></demo-collapsible-panel>
</demo-collapsible>`;
}

const markup = hint('data-story-target');

const meta: Meta<Props> = {
    title: 'Disclosure/Collapsible',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        defaultOpen: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(`<div class="sb-narrow">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'collapsible.description' }
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
                t('collapsible.sections.onACard.title'),
                t('collapsible.sections.onACard.description'),
                grid(card(hint()) + card(hint('default-open')) + card(hint('disabled')), 280)
            )
        )
};
