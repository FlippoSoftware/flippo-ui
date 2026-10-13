import { textarea as recipe } from '@flippo-software/component-styles/textarea';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, renderExample, row, section, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

/** The field control owns the value and the disabled state: `control` takes `default-value` and `disabled`. */
function answer(attributes = '', textareaAttributes = '', control = ''): string {
    return `<demo-textarea ${attributes}><demo-textarea-control ${control} as-child><textarea rows="3" aria-label="Ответ" placeholder="Введи текст ответа" ${textareaAttributes}></textarea></demo-textarea-control></demo-textarea>`;
}

const markup = answer('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Textarea',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'Многострочное поле: ответ карточки, описание набора. Рамка ведёт себя как у Input.' }
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
                'Состояния',
                'Пустое, заполненное и недоступное.',
                row('blank', answer(), { fill: true }) +
                    row('filled', answer('', '', 'default-value="Пользователи воспринимают эстетичный дизайн как более удобный."'), {
                        fill: true
                    }) +
                    row('disabled', answer('', '', 'disabled default-value="Карточка заблокирована владельцем набора."'), { fill: true })
            ) +
                section(
                    'На карточке',
                    'Inverted — для полей на поверхности bg-1.',
                    row('inverted', answer('appearance="inverted"', 'rows="4"'), { fill: true }),
                    { raised: true }
                )
        )
};
