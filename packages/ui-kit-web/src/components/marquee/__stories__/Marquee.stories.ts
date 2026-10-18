import { marquee as recipe } from '@flippo-software/component-styles/marquee';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/web-components';

import { icon, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { speed?: number; direction?: 'normal' | 'reverse'; pauseOnHover?: boolean };

const TOPICS = (): [IconName, string][] => [
    ['learn', t('common.uxLaws')],
    ['globe', t('common.englishB2')],
    ['set', 'JavaScript'],
    ['star', t('marquee.content.artHistory')],
    ['bookmark', t('marquee.content.anatomy')],
    ['hint', t('common.psychology')]
];

const chip = (name: IconName, text: string) =>
    `<span class="fl-text-body-minus-default" style="display: inline-flex; align-items: center; gap: 6px; margin-inline-end: 12px; padding-block: 8px; padding-inline: 14px; border-radius: 999px; background: var(--fl-color-bg-2); color: var(--fl-color-text-2); white-space: nowrap">${icon(name)}${text}</span>`;

function ticker(attributes = ''): string {
    return `<demo-marquee ${attributes}><demo-marquee-track>${TOPICS()
        .map(([name, text]) => chip(name, text))
        .join('')}</demo-marquee-track></demo-marquee>`;
}

const markup = ticker('data-story-target pause-on-hover');

const meta: Meta<Props> = {
    title: 'Display/Marquee',
    args: {},
    argTypes: {
        ...variantControls(recipe),
        speed: { control: { type: 'range', min: 10, max: 200, step: 10 }, table: { category: 'Behaviour' } },
        direction: { control: 'inline-radio', options: ['normal', 'reverse'], table: { category: 'Behaviour' } },
        pauseOnHover: { control: 'boolean', table: { category: 'Behaviour' } }
    },
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: { component: 'marquee.description' }
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
                t('marquee.sections.edges.title'),
                t('marquee.sections.edges.description'),
                row('plain', ticker(), { fill: true }) + row('fade', ticker('fade'), { fill: true })
            ) +
                section(
                    t('marquee.sections.directionAndSpeed.title'),
                    t('marquee.sections.directionAndSpeed.description'),
                    row('normal', ticker('fade direction="normal" speed="40" pause-on-hover'), { fill: true }) +
                        row('reverse', ticker('fade direction="reverse" speed="60" pause-on-hover'), { fill: true })
                )
        )
};
