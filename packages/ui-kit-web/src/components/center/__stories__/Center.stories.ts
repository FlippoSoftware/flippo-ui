import { center as recipe } from '@flippo-software/component-styles/center';

import type { Meta, StoryObj } from '@storybook/web-components';

import { button, icon, page, renderExample, resizable, resizableSection, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { height?: string };

const markup = () =>
    `<demo-center data-story-target height="180px" width="100%" class="story-surface">${button(t('center.content.centred'))}</demo-center>`;

const empty = () =>
    `<demo-center height="240px" width="100%" class="story-surface"><div style="display: grid; justify-items: center; gap: 12px; text-align: center">${icon('folder')}<demo-text weight="stronger">${t('center.content.thereAreNoSets')}</demo-text><demo-text size="body-minus" color="tertiary">${t('center.content.createYourFirstSet')}</demo-text>${button(`${icon('plus')}${t('common.createASet')}`, 'size="small"')}</div></demo-center>`;

const meta: Meta<Props> = {
    title: 'Layout/Center',
    args: { height: '180px' },
    argTypes: { ...variantControls(recipe), height: { control: 'text' } },
    render: (args: Props) => renderExample(resizable(markup()), args),
    parameters: { docs: { source: { code: markup(), language: 'html' }, description: { component: 'center.description' } } }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => page(resizableSection(t('center.sections.emptyState.title'), t('center.sections.emptyState.description'), empty()))
};
