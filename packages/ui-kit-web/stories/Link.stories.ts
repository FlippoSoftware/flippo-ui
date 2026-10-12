import { link as recipe } from '@flippo-software/component-styles/link';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { card, grid, icon, page, row, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

function link(content: string, attributes = '', href = '#set'): string {
    return `<demo-link ${attributes} as-child><a href="${href}">${content}</a></demo-link>`;
}

const markup = `<demo-link data-story-target as-child>
<a href="#set">${icon('plus')}Ссылка${icon('arrow-outward')}</a>
</demo-link>`;

const meta: Meta<Props> = {
    title: 'Actions/Link',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Ссылка (Figma "Link"): нейтральная и брендовая, с иконками до и после текста. Нативный `<a>` — через `as-child`; иконки — дочерние `<svg>` размером с текст.'
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
                'Варианты',
                'Neutral — для второстепенных переходов, Branded — когда ссылка должна быть заметна.',
                (['neutral', 'branded'] as const)
                    .map((variant) =>
                        row(
                            variant,
                            link('Ссылка', `variant="${variant}"`) +
                                link(`${icon('plus')}Ссылка${icon('arrow-outward')}`, `variant="${variant}"`) +
                                link(`${icon('arrow-back')}Назад к коллекции`, `variant="${variant}"`) +
                                link('С подчёркиванием', `variant="${variant}" underline`)
                        )
                    )
                    .join('')
            ) +
                section(
                    'Размеры',
                    'Small (Body–) и Medium (Body); inherit берёт шрифт окружающего текста.',
                    row('small', link(`Открыть набор${icon('arrow-outward')}`, 'size="small"')) +
                        row('medium', link(`Открыть набор${icon('arrow-outward')}`, 'size="medium"')) +
                        row(
                            'inherit',
                            `<p class="sb-section-text">Подробнее о законах UX читайте в ${link('руководстве', 'size="inherit" variant="branded" underline', '#guide')}.</p>`
                        )
                )
        )
};

export const Examples: Story = {
    render: () =>
        page(
            section(
                'В интерфейсе',
                'Ссылки в навигации и в карточках.',
                grid(
                    card(link(`${icon('arrow-back')}Коллекция`, '', '#collection'), 'Навигация назад') +
                        card(
                            `<p class="sb-section-text">Материалы курса доступны в открытом доступе.</p>${link(`${icon('learn')}Перейти к курсу${icon('arrow-outward')}`, 'variant="branded"', '#course')}`,
                            'Внешний ресурс'
                        ),
                    280
                )
            )
        )
};
