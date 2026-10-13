import { form as recipe } from '@flippo-software/component-styles/form';

import type { Meta, StoryObj } from '@storybook/web-components';

import { button, card, icon, page, renderExample, section, textInput, toggleSwitch, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = `<demo-form data-story-target as-child><form>
<demo-field name="title"><demo-field-label>Название</demo-field-label>${textInput('', 'name="title" required placeholder="Например, Законы UX"')}<demo-field-error match="valueMissing">Введите название набора</demo-field-error></demo-field>
<demo-field name="description"><demo-field-label>Описание</demo-field-label>${textInput('', 'name="description" placeholder="О чём этот набор"')}<demo-field-description>Необязательно</demo-field-description></demo-field>
${toggleSwitch('Виден в сообществе', 'name="public" default-checked')}
<div class="sb-items"><demo-button as-child><button type="submit">${icon('plus')}Создать набор</button></demo-button>${button('Сбросить', 'variant="label"').replace('type="button"', 'type="reset"')}</div>
<output aria-live="polite" class="sb-caption"></output>
</form></demo-form>`;

/** Shows the created set instead of sending the form. */
function handleSubmit(root: HTMLElement): void {
    const form = root.querySelector('form');
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = new FormData(form).get('title');
        const output = root.querySelector('output');
        if (output) output.textContent = title ? `Создан набор «${String(title)}»` : '';
    });
}

const meta: Meta<Props> = {
    title: 'Forms/Form',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args, handleSubmit),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Форма над нативным `<form>`: колонка полей с отступом 24px; проверка полей показывается через `demo-field-error` после отправки.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Examples: Story = {
    render: () =>
        page(
            section(
                'Новый набор',
                'Отправьте пустую форму, чтобы увидеть ошибку обязательного поля.',
                `<div class="sb-medium">${card(markup.replace('data-story-target ', ''))}</div>`
            ),
            handleSubmit
        )
};
