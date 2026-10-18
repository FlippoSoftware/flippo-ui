import { toggleGroup as recipe } from '@flippo-software/component-styles/toggle-group';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function item(value: string, content: string, attributes = '', label = ''): string {
    return `<demo-toggle value="${value}" ${attributes} as-child><button type="button"${label ? ` aria-label="${label}"` : ''}>${content}</button></demo-toggle>`;
}

function formatting(attributes = ''): string {
    return `<demo-toggle-group ${attributes} multiple default-value="bold" aria-label="${t('toggleGroup.labels.textFormatting')}">
${item('bold', icon('format-bold'), '', t('common.bold'))}
${item('italic', icon('format-italic'), '', t('common.italic'))}
${item('underline', icon('format-underline'), '', t('common.underlined'))}
${item('list', icon('format-list-ul'), '', t('common.list'))}
</demo-toggle-group>`;
}

const markup = formatting('data-story-target');

const meta: Meta<Props> = {
    title: 'Actions/ToggleGroup',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'toggleGroup.descriptionWeb'
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
                t('toggleGroup.sections.look.title'),
                t('toggleGroup.sections.look.description'),
                row('plain', formatting()) + row('contained', formatting('contained')) + row('disabled', formatting('contained disabled'))
            ) +
                section(
                    t('toggleGroup.sections.oneOfSeveral.title'),
                    t('toggleGroup.sections.oneOfSeveral.description'),
                    row(
                        'single',
                        `<demo-toggle-group contained default-value="list" aria-label="${t('toggleGroup.labels.collectionView')}">${item('list', `${icon('format-list-ul')}${t('common.list')}`, 'variant="labeled"')}${item('cards', `${icon('set')}${t('common.cards')}`, 'variant="labeled"')}</demo-toggle-group>`
                    )
                )
        )
};
