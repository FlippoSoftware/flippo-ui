import { checkboxGroup as recipe } from '@flippo-software/component-styles/checkbox-group';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, checkbox, grid, page, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const TOPICS = () =>
    [
        ['design', t('common.design')],
        ['psychology', t('common.psychology')],
        ['research', t('checkboxGroup.content.research')]
    ] as const;

function topics(attributes = ''): string {
    return `<demo-checkbox-group ${attributes} aria-label="${t('checkboxGroup.labels.topics')}">${TOPICS()
        .map(([value, label]) => checkbox(label, `value="${value}"`))
        .join('')}</demo-checkbox-group>`;
}

/** `defaultValue` and `allValues` are array properties: they are set after the markup is parsed. */
function setDefaults(root: HTMLElement): void {
    for (const group of root.querySelectorAll<HTMLElement & { defaultValue?: string[]; allValues?: string[] }>('demo-checkbox-group')) {
        group.defaultValue = ['design'];
        if (group.hasAttribute('data-select-all')) group.allValues = TOPICS().map(([value]) => value);
    }
}

const markup = topics('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/CheckboxGroup',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args, setDefaults),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'checkboxGroup.descriptionWeb'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const selectAll = () =>
    `<demo-checkbox-group data-select-all aria-label="${t('checkboxGroup.labels.topics')}">${checkbox(t('checkboxGroup.content.allTopics'), 'parent')}<div style="display: grid; gap: 12px; padding-inline-start: 32px">${TOPICS()
        .map(([value, label]) => checkbox(label, `value="${value}"`))
        .join('')}</div></demo-checkbox-group>`;

export const Gallery: Story = {
    render: () =>
        page(
            section(
                t('checkboxGroup.sections.layout.title'),
                t('checkboxGroup.sections.layout.description'),
                grid(
                    card(topics(), 'vertical') +
                        card(topics('orientation="horizontal"'), 'horizontal') +
                        card(topics('disabled'), 'disabled'),
                    260
                )
            ) + section(t('checkboxGroup.sections.selectAll.title'), t('checkboxGroup.sections.selectAll.descriptionWeb'), selectAll()),
            setDefaults
        )
};
