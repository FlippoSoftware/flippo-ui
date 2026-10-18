import { list as recipe } from '@flippo-software/component-styles/list';

import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const STEPS = () => [
    t('list.content.createYourSet'),
    t('list.content.addCards'),
    t('list.content.inviteMembers'),
    t('list.content.startReviewing')
];

const item = (marker: string, content: string) =>
    `<demo-list-item as-child><li><demo-list-marker>${marker}</demo-list-marker>${content}</li></demo-list-item>`;

/** `attributes` go on the native list, the `as-child` target that gets the classes (`data-nested`, `data-orientation`). */
function list(tag: 'ol' | 'ul', items: string, attributes = '', host = ''): string {
    return `<demo-list ${host} as-child><${tag} ${attributes}>${items}</${tag}></demo-list>`;
}

const ordered = (entries: readonly string[], attributes = '', host = '') =>
    list('ol', entries.map((entry, index) => item(`${index + 1}.`, entry)).join(''), attributes, host);
const bulleted = (entries: readonly string[], attributes = '') => list('ul', entries.map((entry) => item('•', entry)).join(''), attributes);

const nested = () =>
    list(
        'ol',
        `<demo-list-item as-child><li><demo-list-marker>1.</demo-list-marker><demo-list-subheader id="laws-ux">${t('common.uxLaws')}</demo-list-subheader>${ordered([t('common.hickSLaw'), t('common.fittsSLaw'), t('common.millerSLaw')], 'data-nested aria-labelledby="laws-ux"')}</li></demo-list-item>` +
            `<demo-list-item as-child><li><demo-list-marker>2.</demo-list-marker><demo-list-subheader id="laws-gestalt">${t('list.content.gestalt')}</demo-list-subheader>${bulleted([t('list.content.proximity'), t('list.content.similarity'), t('list.content.closure')], 'data-nested aria-labelledby="laws-gestalt"')}</li></demo-list-item>`
    );

const FOLDERS = () =>
    [
        ['ux', t('common.uxLaws'), '32'],
        ['js', 'JavaScript', '18'],
        ['en', t('common.englishB2'), '120'],
        ['archive', t('list.content.archive'), '0']
    ] as const;

const folders = () =>
    list(
        'ul',
        FOLDERS()
            .map(
                ([id, name, count]) =>
                    `<demo-list-item as-child><li data-interactive role="button" tabindex="${id === 'archive' ? '-1' : '0'}"${id === 'ux' ? ' data-selected aria-selected="true"' : ''}${id === 'archive' ? ' data-disabled aria-disabled="true"' : ''}>${icon('folder')}<span style="flex: 1">${name}</span><span class="sb-caption">${count}</span></li></demo-list-item>`
            )
            .join(''),
        'style="inline-size: 100%"'
    );

/** Selects the pressed folder: the presentation list has no selection state of its own. */
function selectFolders(root: HTMLElement): void {
    root.addEventListener('click', (event) => {
        const pressed = (event.target as Element).closest('li[data-interactive]:not([data-disabled])');
        if (!pressed) return;
        for (const folder of pressed.parentElement?.children ?? []) {
            folder.toggleAttribute('data-selected', folder === pressed);
            folder.setAttribute('aria-selected', String(folder === pressed));
        }
    });
}

const markup = () => ordered(STEPS(), '', 'data-story-target');

const meta: Meta<Props> = {
    title: 'Display/List',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: {
                component: 'list.descriptionWeb'
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
                t('list.sections.numberedAndBulleted.title'),
                '',
                row('ordered', ordered(STEPS())) + row('unordered', bulleted(STEPS()))
            ) +
                section(
                    t('list.sections.nestedListsWithSubheaders.title'),
                    t('list.sections.nestedListsWithSubheaders.descriptionWeb'),
                    nested()
                ) +
                section(
                    t('list.sections.interactiveItems.title'),
                    t('list.sections.interactiveItems.description'),
                    `<div class="sb-narrow">${folders()}</div>`
                ) +
                section(
                    t('list.sections.horizontal.title'),
                    t('list.sections.horizontal.descriptionWeb'),
                    bulleted([t('common.design'), 'UX', t('common.psychology'), t('list.content.exam')], 'data-orientation="horizontal"')
                ),
            selectFolders
        )
};
