import { grid as recipe } from '@flippo-software/component-styles/grid';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, resizable, resizableSection, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { columns?: number; spacing?: number };

const cell = (content: string, attributes = '') =>
    `<demo-grid-item ${attributes} p="12px" class="story-surface">${content}</demo-grid-item>`;

const markup = `<demo-grid data-story-target columns="3" spacing="3" width="100%">${['1', '2', '3', '4', '5', '6'].map((label) => cell(label)).join('')}</demo-grid>`;

const layout = () =>
    `<demo-grid columns="4" spacing="2" width="100%">${cell(t('grid.content.headerColSpan4'), 'col-span="4"')}${cell(t('grid.content.foldersRowSpan2'), 'row-span="2"')}${cell(t('grid.content.setsColSpan3'), 'col-span="3"')}${cell(t('grid.content.activityColSpan3'), 'col-span="3"')}</demo-grid>`;

const adaptive = `<demo-grid columns="repeat(auto-fill, minmax(140px, 1fr))" spacing="2" width="100%">${Array.from({ length: 7 }, (_, index) => cell(`${t('common.set')} ${index + 1}`)).join('')}</demo-grid>`;

const meta: Meta<Props> = {
    title: 'Layout/Grid',
    args: { columns: 3, spacing: 3 },
    argTypes: {
        ...variantControls(recipe),
        columns: { control: { type: 'range', min: 1, max: 6, step: 1 } },
        spacing: { control: { type: 'range', min: 0, max: 8, step: 1 } }
    },
    render: (args: Props) => renderExample(resizable(markup), args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'grid.descriptionWeb'
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
            resizableSection(t('grid.sections.pageLayout.title'), t('grid.sections.pageLayout.description'), layout()) +
                resizableSection(t('grid.sections.responsiveColumns.title'), t('grid.sections.responsiveColumns.description'), adaptive)
        )
};
