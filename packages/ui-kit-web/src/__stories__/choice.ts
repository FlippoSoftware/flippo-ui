import { t } from '@flippo-software/workspace-tools/storybook/i18n';
/**
 * Markup of the choice controls shared by their stories: a `<label>` (the styled label part, `as-child`) around the
 * control and its text, so a press on the text toggles the control.
 */
export function checkbox(label: string, attributes = '', labelAttributes = ''): string {
    return `<demo-checkbox-label ${labelAttributes} as-child><label><demo-checkbox ${attributes}><demo-checkbox-indicator></demo-checkbox-indicator></demo-checkbox>${label}</label></demo-checkbox-label>`;
}

export function radio(value: string, label: string, attributes = '', labelAttributes = ''): string {
    return `<demo-radio-label ${labelAttributes} as-child><label><demo-radio value="${value}" ${attributes}><demo-radio-indicator></demo-radio-indicator></demo-radio>${label}</label></demo-radio-label>`;
}

export function toggleSwitch(label: string, attributes = '', labelAttributes = ''): string {
    return `<demo-switch-label ${labelAttributes} as-child><label><demo-switch ${attributes}><demo-switch-thumb></demo-switch-thumb></demo-switch>${label}</label></demo-switch-label>`;
}

/** The content of a choice card: a title (with an optional icon) over a muted line. */
export function cardText(title: string, text: string, iconSvg = ''): string {
    return `<span style="display: grid; gap: 2px"><strong style="display: flex; align-items: center; gap: 8px">${iconSvg}${title}</strong><span style="color: var(--fl-color-text-4)">${text}</span></span>`;
}

/**
 * A text input box: an optional search icon, the native `<input>` and an optional clear button. The field control
 * owns the value and the disabled state: `control` takes `default-value` and `disabled`, not the `<input>`.
 */
export function textInput(
    attributes = '',
    inputAttributes = '',
    options: { icon?: boolean; clear?: boolean; control?: string } = {}
): string {
    return `<demo-input ${attributes}>${options.icon ? '<demo-input-icon aria-hidden="true"></demo-input-icon>' : ''}<demo-input-control ${options.control ?? ''} as-child><input ${inputAttributes}/></demo-input-control>${options.clear ? `<demo-input-clear aria-label="${t('common.clear')}"></demo-input-clear>` : ''}</demo-input>`;
}

/** A search box: icon, input and clear button. */
export function search(attributes = '', control = '', inputAttributes = ''): string {
    return textInput(attributes, `${t('storyKit.content.searchSearch')} ${inputAttributes}`, { icon: true, clear: true, control });
}
