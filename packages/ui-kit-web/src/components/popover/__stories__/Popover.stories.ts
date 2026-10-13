import { popover as recipe } from '@flippo-software/component-styles/popover';

import type { Meta, StoryObj } from '@storybook/web-components';

import { button, icon, page, renderExample, row, section, triggerButton, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const PEOPLE = [
    ['ЕГ', 'Егор Горочкин', 'Владелец'],
    ['НЗ', 'Настя Завалова', '3 карточки'],
    ['РШ', 'Роберт Шумелов', '1 карточка']
] as const;

const people = `<div class="sb-items sb-items--column" style="gap: 10px; margin-block: 6px">${PEOPLE.map(
    ([initials, name, note]) =>
        `<div style="display: flex; align-items: center; gap: 10px"><demo-avatar size="small"><demo-avatar-fallback>${initials}</demo-avatar-fallback></demo-avatar><span style="display: grid"><span style="color: var(--fl-color-text-primary)">${name}</span><span class="sb-caption">${note}</span></span></div>`
).join('')}</div>`;

function participants(attributes = '', side = ''): string {
    return `<demo-popover ${attributes}>
<demo-popover-trigger as-child>${triggerButton(`${icon('person-add')}6 участников`, { variant: 'secondary' })}</demo-popover-trigger>
<demo-popover-positioner ${side ? `side="${side}"` : ''}><demo-popover-popup>
<demo-popover-arrow></demo-popover-arrow>
<demo-popover-title>Участники набора</demo-popover-title>
<demo-popover-description>3 из 7 карточек назначено.</demo-popover-description>
${people}
${button(`${icon('person-add')}Пригласить`, 'size="small"')}
<demo-popover-close aria-label="Закрыть"></demo-popover-close>
</demo-popover-popup></demo-popover-positioner>
</demo-popover>`;
}

const markup = participants('data-story-target');

const meta: Meta<Props> = {
    title: 'Overlays/Popover',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Всплывающая карточка у триггера: заголовок, описание, произвольное содержимое и крестик закрытия.' }
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
                'Стороны',
                'Попап со стрелкой с любой стороны триггера; у края окна переворачивается.',
                row('side', participants('', 'bottom') + participants('', 'top') + participants('', 'right'))
            )
        )
};
