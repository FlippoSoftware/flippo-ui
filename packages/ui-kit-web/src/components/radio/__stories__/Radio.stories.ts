import { radio as recipe } from '@flippo-software/component-styles/radio';

import type { Meta, StoryObj } from '@storybook/web-components';

import { page, radio, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { disabled?: boolean };

const OPTIONS = () =>
    [
        ['all', t('common.allCards')],
        ['new', t('radio.content.newOnesOnly')],
        ['hard', t('common.hardOnes')]
    ] as const;

function options(attributes = '', labelAttributes = ''): string {
    return `<demo-radio-group default-value="all" orientation="horizontal" aria-label="${t('common.reviewMode')}">${OPTIONS()
        .map(([value, label]) => radio(value, label, attributes, labelAttributes))
        .join('')}</demo-radio-group>`;
}

const markup = options('data-story-target');

const meta: Meta<Props> = {
    title: 'Forms/Radio',
    args: {},
    argTypes: { ...variantControls(recipe), disabled: { control: 'boolean', table: { category: 'Behaviour' } } },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'radio.descriptionWeb'
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
                t('radio.sections.sizes.title'),
                t('radio.sections.sizes.description'),
                (['small', 'medium', 'large'] as const).map((size) => row(size, options(`size="${size}"`, `size="${size}"`))).join('')
            ) + section(t('radio.sections.disabled.title'), t('radio.sections.disabled.description'), row('disabled', options('disabled')))
        )
};
