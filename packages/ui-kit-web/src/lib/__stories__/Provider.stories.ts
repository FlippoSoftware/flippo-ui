import type { Meta, StoryObj } from '@storybook/web-components';

import { getControlSize, registerThemes } from '~@src';
import { button, checkbox, icon, page, row, section, t, textInput, toggleSwitch } from '~@stories';

import type { ControlSize, ThemeSetting } from '~@src';

type Props = { theme: ThemeSetting; size: ControlSize };

registerThemes({ sepia: 'light' });

// A theme of the story's own. In an application it comes from the stylesheet: `@include fl.theme('sepia', light, …)`.
const SEPIA_CSS = `<style>
[data-theme='sepia'] {
    color-scheme: light;
    --fl-color-bg-0: #efe4cc;
    --fl-color-bg-1: #f6edd9;
    --fl-color-bg-2: #ead9b8;
    --fl-color-bg-3: #fbf5e8;
    --fl-color-text-primary: #3b2f1e;
    --fl-color-text-strong: #2a2114;
}</style>`;

/** A row of mixed controls aligned at the top: the checkbox and the switch take the height of the row, centred. */
const controlRow = () => `<div class="sb-items" style="align-items: flex-start">
${textInput('', `aria-label="${t('common.setName')}" placeholder="${t('common.setName')}"`)}
${checkbox(t('common.mineOnly'), 'default-checked')}
${toggleSwitch(t('common.hideDone'))}
<demo-segmented-control default-value="week" aria-label="${t('common.period')}"><demo-segmented-control-item value="day" as-child><button type="button">${t('common.day')}</button></demo-segmented-control-item><demo-segmented-control-item value="week" as-child><button type="button">${t('common.week')}</button></demo-segmented-control-item></demo-segmented-control>
<demo-toggle as-child><button type="button" aria-label="${t('common.favourites')}">${icon('star')}</button></demo-toggle>
${button(t('common.find'))}
</div>`;

function provider(attributes: string, content: string): string {
    return `<demo-provider ${attributes}><div style="display: grid; gap: 12px; padding: 16px; border-radius: 16px; background: var(--fl-color-bg-0)">${content}</div></demo-provider>`;
}

/** The size the provider gives, as `getControlSize(element)` reports it. */
function reportSize(root: HTMLElement): void {
    for (const output of root.querySelectorAll<HTMLElement>('[data-size-report]')) {
        const { size, height } = getControlSize(output);
        output.textContent = `getControlSize(element): ${size}, ${height}px`;
    }
}

const code = `define({ prefix: 'ui', themes: { sepia: 'light' }, theme: 'system', size: 'medium' });

setTheme('dark');                 // the page: data-theme on <html>
subscribeTheme(({ resolvedTheme, colorScheme }) => …);
setControlSize('small');

<ui-provider theme="sepia" size="small">…</ui-provider>   <!-- a part of the page -->
getControlSize(element);          // { size: 'small', height: 40 }`;

const meta: Meta<Props> = {
    title: 'Utilities/Provider',
    args: { theme: 'sepia', size: 'medium' },
    argTypes: {
        theme: { control: 'inline-radio', options: ['system', 'light', 'dark', 'sepia'] },
        size: { control: 'inline-radio', options: ['small', 'medium', 'large'] }
    },
    render: ({ theme, size }: Props) => {
        const root = document.createElement('div');
        root.className = 'story-example';
        root.innerHTML = SEPIA_CSS + provider(`theme="${theme}" size="${size}"`, `${controlRow()}<code data-size-report></code>`);
        queueMicrotask(() => reportSize(root));
        return root;
    },
    parameters: {
        docs: {
            source: { code, language: 'ts' },
            description: {
                component: 'provider.description'
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
            SEPIA_CSS +
                section(
                    t('provider.sections.sizeGrid.title'),
                    t('provider.sections.sizeGrid.description'),
                    (['small', 'medium', 'large'] as const).map((size) => row(size, provider(`size="${size}"`, controlRow()))).join('')
                ) +
                section(
                    t('provider.sections.longLabel.title'),
                    t('provider.sections.longLabel.description'),
                    row(
                        'medium',
                        `<div class="sb-items" style="align-items: flex-start; max-inline-size: 560px">${textInput('', 'aria-label="Email" placeholder="Email"')}${checkbox(
                            t('provider.content.getNotifiedAboutNew'),
                            '',
                            'style="max-inline-size: 260px"'
                        )}</div>`
                    )
                ) +
                section(
                    t('provider.sections.compactLabel.title'),
                    t('provider.sections.compactLabel.description'),
                    row(
                        'compact',
                        `<div class="sb-items sb-items--column" style="align-items: flex-start; gap: 4px">${[
                            t('common.english'),
                            t('common.german'),
                            t('common.spanish')
                        ]
                            .map((language) => checkbox(language, '', 'compact'))
                            .join('')}</div>`
                    )
                ) +
                section(
                    t('provider.sections.themeOfAPart.title'),
                    t('provider.sections.themeOfAPart.description'),
                    (['dark', 'sepia'] as const).map((theme) => row(theme, provider(`theme="${theme}"`, controlRow()))).join('')
                )
        )
};
