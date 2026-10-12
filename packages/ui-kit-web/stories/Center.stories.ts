import { center as recipe } from '@flippo-software/component-styles/center';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { button, icon, page, resizable, resizableSection } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe> & { height?: string };

const markup = `<demo-center data-story-target height="180px" width="100%" class="story-surface">${button('По центру')}</demo-center>`;

const empty = `<demo-center height="240px" width="100%" class="story-surface"><div style="display: grid; justify-items: center; gap: 12px; text-align: center">${icon('folder')}<demo-text weight="stronger">В папке пока нет наборов</demo-text><demo-text size="body-minus" color="tertiary">Создайте первый набор или перенесите готовый.</demo-text>${button(`${icon('plus')}Создать набор`, 'size="small"')}</div></demo-center>`;

const meta: Meta<Props> = {
    title: 'Layout/Center',
    args: { height: '180px' },
    argTypes: { ...variantControls(recipe), height: { control: 'text' } },
    render: (args: Props) => renderExample(resizable(markup), args),
    parameters: { docs: { source: { code: markup, language: 'html' }, description: { component: 'Центрирует содержимое по обеим осям.' } } }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => page(resizableSection('Пустое состояние', 'Типичный случай: заглушка посреди пустой области.', empty))
};
