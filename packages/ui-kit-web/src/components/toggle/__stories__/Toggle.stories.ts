import { toggle as recipe } from '@flippo-software/component-styles/toggle';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean; defaultPressed?: boolean };

function toggle(content: string, attributes = '', label = ''): string {
    return `<demo-toggle ${attributes} as-child><button type="button"${label ? ` aria-label="${label}"` : ''}>${content}</button></demo-toggle>`;
}

const markup = () => `<demo-toggle data-story-target as-child>
<button type="button" aria-label="${t('common.shuffle')}">${icon('shuffle')}</button>
</demo-toggle>`;

const meta: Meta<Props> = {
    title: 'Actions/Toggle',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        disabled: { control: 'boolean', table: { category: 'Behaviour' } },
        defaultPressed: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: {
                component: 'toggle.description'
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
                t('toggle.sections.icon.title'),
                t('toggle.sections.icon.description'),
                (['small', 'medium', 'large'] as const)
                    .map((size) =>
                        row(
                            size,
                            toggle(icon('shuffle'), `size="${size}"`, t('common.shuffle')) +
                                toggle(icon('shuffle'), `size="${size}" default-pressed`, t('common.shuffle')) +
                                toggle(icon('favorite'), `size="${size}"`, t('toggle.content.addToFavourites')) +
                                toggle(icon('shuffle'), `size="${size}" disabled`, t('common.shuffle')) +
                                toggle(icon('shuffle'), `size="${size}" disabled default-pressed`, t('common.shuffle'))
                        )
                    )
                    .join('')
            ) +
                section(
                    t('toggle.sections.labeled.title'),
                    t('toggle.sections.labeled.description'),
                    row(
                        'off / on',
                        toggle(`${icon('shuffle')}Off`, 'variant="labeled"') +
                            toggle(`${icon('shuffle')}On`, 'variant="labeled" default-pressed') +
                            toggle(`${icon('hint')}${t('common.hints')}`, 'variant="labeled" default-pressed')
                    ) +
                        row(
                            'disabled',
                            toggle(`${icon('shuffle')}Off`, 'variant="labeled" disabled') +
                                toggle(`${icon('shuffle')}On`, 'variant="labeled" disabled default-pressed')
                        )
                )
        )
};
