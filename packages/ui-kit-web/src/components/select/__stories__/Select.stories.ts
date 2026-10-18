import { select as recipe } from '@flippo-software/component-styles/select';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/web-components';

import { grid, icon, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const FILTERS = () =>
    [
        ['all', t('common.allCards')],
        ['new', t('select.content.new')],
        ['hard', t('common.hardOnes')],
        ['done', t('select.content.learned')]
    ] as const;

const FOLDERS = (): [string, IconName, string][] => [
    ['term', 'folder', t('common.term2')],
    ['self', 'learn', t('common.selfImprovement')],
    ['lang', 'globe', t('select.content.languages')]
];

function item(value: string, label: string, attributes = '', prefix = ''): string {
    return `<demo-select-item value="${value}" ${attributes}>${prefix}<demo-select-item-text>${label}</demo-select-item-text><demo-select-item-indicator></demo-select-item-indicator></demo-select-item>`;
}

function filter(attributes = '', options: { value?: string; placeholder?: string } = {}): string {
    const { value = 'all', placeholder } = options;
    return `<demo-select ${attributes} data-items="filters"${value ? ` default-value="${value}"` : ''}>
<demo-select-trigger as-child><button type="button" aria-label="${t('select.labels.cardFilter')}"><demo-select-value${placeholder ? ` placeholder="${placeholder}"` : ''}></demo-select-value><demo-select-icon></demo-select-icon></button></demo-select-trigger>
<demo-select-positioner><demo-select-popup><demo-select-list>${FILTERS()
        .map(([itemValue, label]) => item(itemValue, label, itemValue === 'done' ? 'disabled' : ''))
        .join('')}</demo-select-list></demo-select-popup></demo-select-positioner>
</demo-select>`;
}

const folder =
    () => `<demo-field><demo-field-label>${t('select.content.folder')}</demo-field-label><demo-select data-items="folders" default-value="term">
<demo-select-trigger as-child><button type="button" aria-label="${t('select.labels.folder')}"><demo-select-value></demo-select-value><demo-select-icon></demo-select-icon></button></demo-select-trigger>
<demo-select-positioner><demo-select-popup><demo-select-group><demo-select-group-label>${t('select.content.yourFolders')}</demo-select-group-label>${FOLDERS()
        .map(([value, name, label]) => item(value, label, '', icon(name)))
        .join('')}</demo-select-group></demo-select-popup></demo-select-positioner>
</demo-select></demo-field>`;

/** `items` (the labels of the values, for the trigger) is an object property. */
function setItems(root: HTMLElement): void {
    const items = {
        filters: Object.fromEntries(FILTERS()),
        folders: Object.fromEntries(FOLDERS().map(([value, , label]) => [value, label]))
    };
    for (const select of root.querySelectorAll<HTMLElement & { items?: Record<string, string> }>('demo-select[data-items]')) {
        select.items = items[select.dataset.items as keyof typeof items];
    }
}

const markup = filter('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Select',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(`<div class="sb-narrow">${markup}</div>`, args, setItems),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'select.descriptionWeb'
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
                t('select.sections.sizes.title'),
                t('select.sections.sizes.description'),
                (['large', 'medium', 'small'] as const)
                    .map((size) => row(size, `<div class="sb-narrow">${filter(`size="${size}"`)}</div>`))
                    .join('')
            ) +
                section(
                    t('select.sections.lookAndStates.title'),
                    t('select.sections.lookAndStates.description'),
                    grid(
                        filter('appearance="inverted"') +
                            filter('appearance="inverted"', { value: '', placeholder: t('select.content.chooseAFilter') }) +
                            filter('appearance="inverted" disabled'),
                        260
                    ),
                    { raised: true }
                ) +
                section(
                    t('select.sections.withAGroupAnd.title'),
                    t('select.sections.withAGroupAnd.description'),
                    `<div class="sb-narrow">${folder()}</div>`
                ),
            setItems
        )
};
