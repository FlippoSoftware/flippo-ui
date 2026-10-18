import { autocomplete as recipe } from '@flippo-software/component-styles/autocomplete';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const SETS = () => [
    t('common.uxLawsExam'),
    t('common.newSet'),
    'C++',
    t('common.englishB2'),
    t('autocomplete.content.historyOfArt'),
    t('autocomplete.content.psychologyOfPerception')
];

function search(attributes = '', inputAttributes = ''): string {
    return `<demo-autocomplete ${attributes}>
<demo-autocomplete-input-group>
${icon('magnifier').replace('<svg', '<svg class="fl-combobox-icon"')}
<demo-autocomplete-input as-child><input aria-label="${t('common.searchSets')}" placeholder="${t('common.searchSets')}" ${inputAttributes}/></demo-autocomplete-input>
<demo-autocomplete-clear aria-label="${t('common.clear')}"></demo-autocomplete-clear>
</demo-autocomplete-input-group>
<demo-autocomplete-positioner><demo-autocomplete-popup>
<demo-autocomplete-empty>${t('autocomplete.content.noSetsFound')}</demo-autocomplete-empty>
<demo-autocomplete-list>${SETS()
        .map((set) => `<demo-autocomplete-item value="${set}">${icon('set')}${set}</demo-autocomplete-item>`)
        .join('')}</demo-autocomplete-list>
</demo-autocomplete-popup></demo-autocomplete-positioner>
</demo-autocomplete>`;
}

const markup = search('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Autocomplete',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(`<div class="sb-medium">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'autocomplete.description'
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
                t('autocomplete.sections.searchBar.title'),
                t('autocomplete.sections.searchBar.description'),
                (['large', 'medium', 'small'] as const).map((size) => row(size, medium(search(`size="${size}"`)))).join('')
            ) +
                section(
                    t('autocomplete.sections.onACard.title'),
                    t('autocomplete.sections.onACard.description'),
                    row('inverted', medium(search('appearance="inverted"'))) +
                        row('disabled', medium(search('appearance="inverted" disabled', 'disabled'))),
                    { raised: true }
                )
        )
};
