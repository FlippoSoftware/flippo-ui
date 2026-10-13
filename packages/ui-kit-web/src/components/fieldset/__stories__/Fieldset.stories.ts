import { fieldset as recipe } from '@flippo-software/component-styles/fieldset';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, grid, page, renderExample, section, textInput, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function contacts(attributes = ''): string {
    const disabled = attributes.includes('disabled') ? ' disabled' : '';
    return `<demo-fieldset ${attributes} as-child><fieldset${disabled}>
<demo-fieldset-legend as-child><legend>Контакты автора</legend></demo-fieldset-legend>
<demo-field name="name"><demo-field-label>Имя</demo-field-label>${textInput('', 'placeholder="Егор Горочкин"')}</demo-field>
<demo-field name="email"><demo-field-label>Email</demo-field-label>${textInput('', 'type="email" placeholder="egor@flippo.app"')}<demo-field-description>Для уведомлений о новых участниках</demo-field-description></demo-field>
</fieldset></demo-fieldset>`;
}

const markup = contacts('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Fieldset',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Группа полей с заголовком над нативным `<fieldset>`; `disabled` выключает все поля группы.' }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () => page(section('Группа полей', 'Обычная и недоступная.', grid(card(contacts()) + card(contacts('disabled')), 320)))
};
