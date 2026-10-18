import { fieldset as recipe } from '@flippo-software/component-styles/fieldset';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, grid, page, renderExample, section, t, textInput, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

function contacts(attributes = ''): string {
    const disabled = attributes.includes('disabled') ? ' disabled' : '';
    return `<demo-fieldset ${attributes} as-child><fieldset${disabled}>
<demo-fieldset-legend as-child><legend>${t('fieldset.content.authorSContacts')}</legend></demo-fieldset-legend>
<demo-field name="name"><demo-field-label>${t('fieldset.content.yourName')}</demo-field-label>${textInput('', `placeholder="${t('common.egorGorochkin')}"`)}</demo-field>
<demo-field name="email"><demo-field-label>Email</demo-field-label>${textInput('', 'type="email" placeholder="egor@flippo.app"')}<demo-field-description>${t('fieldset.content.forNotificationsAboutNew')}</demo-field-description></demo-field>
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
            description: { component: 'fieldset.descriptionWeb' }
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
                t('fieldset.sections.fieldGroup.title'),
                t('fieldset.sections.fieldGroup.description'),
                grid(card(contacts()) + card(contacts('disabled')), 320)
            )
        )
};
