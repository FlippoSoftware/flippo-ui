import { dialog as recipe } from '@flippo-software/component-styles/dialog';

import type { Meta, StoryObj } from '@storybook/web-components';

import { textInput } from './choice';
import { renderExample, variantControls } from './helpers';
import { icon, page, row, section, triggerButton } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

function close(label: string, variant: 'label' | 'primary' | 'danger'): string {
    return `<demo-dialog-close as-child>${triggerButton(label, { variant })}</demo-dialog-close>`;
}

function deleteSet(attributes = ''): string {
    return `<demo-dialog ${attributes}>
<demo-dialog-trigger as-child>${triggerButton(`${icon('delete')}Удалить набор`, { variant: 'danger' })}</demo-dialog-trigger>
<demo-dialog-backdrop></demo-dialog-backdrop>
<demo-dialog-popup>
<demo-dialog-title>Удалить набор?</demo-dialog-title>
<demo-dialog-description>«Экзамен Законы UX» и 7 карточек исчезнут у всех участников. Это действие нельзя отменить.</demo-dialog-description>
<demo-dialog-actions>${close('Отмена', 'label')}${close('Удалить', 'danger')}</demo-dialog-actions>
<demo-dialog-close aria-label="Закрыть"></demo-dialog-close>
</demo-dialog-popup>
</demo-dialog>`;
}

function renameSet(attributes = '', label = 'Переименовать'): string {
    return `<demo-dialog ${attributes}>
<demo-dialog-trigger as-child>${triggerButton(`${icon('pencil')}${label}`, { variant: 'secondary' })}</demo-dialog-trigger>
<demo-dialog-backdrop></demo-dialog-backdrop>
<demo-dialog-popup>
<demo-dialog-title>Новое название</demo-dialog-title>
<demo-field name="title"><demo-field-label>Название набора</demo-field-label>${textInput('appearance="inverted"', '', { control: 'default-value="Экзамен Законы UX"' })}</demo-field>
<demo-dialog-actions>${close('Отмена', 'label')}${close('Сохранить', 'primary')}</demo-dialog-actions>
<demo-dialog-close aria-label="Закрыть"></demo-dialog-close>
</demo-dialog-popup>
</demo-dialog>`;
}

const markup = deleteSet('data-story-target');

const meta: Meta<Props> = {
    title: 'Overlays/Dialog',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Модальный диалог: подложка затемняет страницу и перехватывает нажатия — нажатие на неё закрывает диалог. Закрывается и по Escape; крестик — `demo-dialog-close` без `as-child`.'
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
                'Подтверждение и форма',
                'Опасное действие с подтверждением; короткая форма в диалоге.',
                row('confirm', deleteSet()) + row('form', renameSet())
            ) +
                section(
                    'Размеры',
                    'Small 420, Medium 732, Large 1064 (по ширине окна на узких экранах).',
                    row(
                        'sizes',
                        renameSet('size="small"', 'Small') + renameSet('size="medium"', 'Medium') + renameSet('size="large"', 'Large')
                    )
                )
        )
};
