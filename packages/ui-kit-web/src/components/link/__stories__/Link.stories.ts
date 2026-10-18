import { link as recipe } from '@flippo-software/component-styles/link';

import type { Meta, StoryObj } from '@storybook/web-components';

import { card, grid, icon, page, renderExample, row, section, t, variantControls } from '~@stories';

import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

function link(content: string, attributes = '', href = '#set'): string {
    return `<demo-link ${attributes} as-child><a href="${href}">${content}</a></demo-link>`;
}

const markup = () => `<demo-link data-story-target as-child>
<a href="#set">${icon('plus')}${t('link.content.link')}${icon('arrow-outward')}</a>
</demo-link>`;

const meta: Meta<Props> = {
    title: 'Actions/Link',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup(), args),
    parameters: {
        docs: {
            source: { code: markup(), language: 'html' },
            description: {
                component: 'link.descriptionWeb'
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
                t('link.sections.variants.title'),
                t('link.sections.variants.description'),
                (['neutral', 'branded'] as const)
                    .map((variant) =>
                        row(
                            variant,
                            link(t('link.content.link'), `variant="${variant}"`) +
                                link(`${icon('plus')}${t('link.content.link')}${icon('arrow-outward')}`, `variant="${variant}"`) +
                                link(`${icon('arrow-back')}${t('link.content.backToTheCollection')}`, `variant="${variant}"`) +
                                link(t('link.content.withAnUnderline'), `variant="${variant}" underline`)
                        )
                    )
                    .join('')
            ) +
                section(
                    t('link.sections.sizes.title'),
                    t('link.sections.sizes.description'),
                    row('small', link(`${t('common.openTheSet')}${icon('arrow-outward')}`, 'size="small"')) +
                        row('medium', link(`${t('common.openTheSet')}${icon('arrow-outward')}`, 'size="medium"')) +
                        row(
                            'inherit',
                            `<p class="sb-section-text">${t('link.content.readMoreAboutThe')} ${link(t('link.content.guide'), 'size="inherit" variant="branded" underline', '#guide')}.</p>`
                        )
                )
        )
};

export const Examples: Story = {
    render: () =>
        page(
            section(
                t('link.sections.inAnInterface.title'),
                t('link.sections.inAnInterface.description'),
                grid(
                    card(link(`${icon('arrow-back')}${t('common.collection')}`, '', '#collection'), t('link.content.backNavigation')) +
                        card(
                            `<p class="sb-section-text">${t('link.content.theCourseMaterialsAre')}</p>${link(`${icon('learn')}${t('link.content.goToTheCourse')}${icon('arrow-outward')}`, 'variant="branded"', '#course')}`,
                            t('link.content.externalResource')
                        ),
                    280
                )
            )
        )
};
