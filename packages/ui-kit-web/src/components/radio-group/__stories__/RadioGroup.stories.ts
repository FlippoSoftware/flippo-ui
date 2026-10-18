import { radioGroup as recipe } from '@flippo-software/component-styles/radio-group';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, grid, page, radio, renderExample, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const ACCESS = () =>
    [
        ['private', t('radioGroup.content.onlyMe')],
        ['link', t('radioGroup.content.anyoneWithTheLink')],
        ['public', t('radioGroup.content.everyoneInTheCommunity')]
    ] as const;

function access(attributes = ''): string {
    return `<demo-radio-group ${attributes} default-value="link" aria-label="${t('radioGroup.labels.accessToTheSet')}">${ACCESS()
        .map(([value, label]) => radio(value, label))
        .join('')}</demo-radio-group>`;
}

const markup = access('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/RadioGroup',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'radioGroup.description' }
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
                t('radioGroup.sections.layout.title'),
                t('radioGroup.sections.layout.description'),
                grid(
                    card(access(), 'vertical') +
                        card(access('orientation="horizontal"'), 'horizontal') +
                        card(access('disabled'), 'disabled'),
                    300
                )
            )
        )
};
