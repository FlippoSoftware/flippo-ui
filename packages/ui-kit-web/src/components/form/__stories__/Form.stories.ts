import { form as recipe } from '@flippo-software/component-styles/form';

import type { Meta, StoryObj } from '@storybook/web-components';

import { button, card, icon, page, renderExample, section, t, textInput, toggleSwitch, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const markup = () => `<demo-form data-story-target as-child><form>
<demo-field name="title"><demo-field-label>${t('common.name')}</demo-field-label>${textInput('', `name="title" required placeholder="${t('form.placeholders.uxLawsSay')}"`)}<demo-field-error match="valueMissing">${t('form.content.enterTheNameOf')}</demo-field-error></demo-field>
<demo-field name="description"><demo-field-label>${t('form.content.description')}</demo-field-label>${textInput('', `name="description" placeholder="${t('form.placeholders.whatThisSetIs')}"`)}<demo-field-description>${t('form.content.optional')}</demo-field-description></demo-field>
${toggleSwitch(t('form.content.visibleInTheCommunity'), 'name="public" default-checked')}
<div class="sb-items"><demo-button as-child><button type="submit">${icon('plus')}${t('common.createASet')}</button></demo-button>${button(t('form.content.reset'), 'variant="label"').replace('type="button"', 'type="reset"')}</div>
<output aria-live="polite" class="sb-caption"></output>
</form></demo-form>`;

/** Shows the created set instead of sending the form. */
function handleSubmit(root: HTMLElement): void {
    const form = root.querySelector('form');
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = new FormData(form).get('title');
        const output = root.querySelector('output');
        if (output) output.textContent = title ? `${t('form.content.createdTheSet')}${String(title)}»` : '';
    });
}

const meta: Meta<Props> = {
    title: 'Forms/Form',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup(), args, handleSubmit),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: {
                component: 'form.descriptionWeb'
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
                t('form.sections.newSet.title'),
                t('form.sections.newSet.description'),
                `<div class="sb-medium">${card(markup().replace('data-story-target ', ''))}</div>`
            ),
            handleSubmit
        )
};
