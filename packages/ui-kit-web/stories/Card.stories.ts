import { card as recipe } from '@flippo-software/component-styles/card';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { button, grid, icon, page, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

function invite(attributes = ''): string {
    return `<demo-card ${attributes}>
<demo-card-content>
<demo-card-title as-child><h3>Совместная работа</h3></demo-card-title>
<demo-card-description as-child><p>Пригласите друзей в набор: каждый добавит свои карточки, а повторять будете вместе.</p></demo-card-description>
</demo-card-content>
<demo-card-footer>${button(`${icon('person-add')}Пригласить`)}${button('Позже', 'variant="label"')}</demo-card-footer>
</demo-card>`;
}

function setCard(title: string, count: number, learned: number): string {
    return `<demo-card>
<demo-card-content>
<span class="sb-caption" style="display: flex; align-items: center; gap: 6px; color: var(--fl-color-set)">${icon('set')}${count} карточек</span>
<demo-card-title as-child><h3>${title}</h3></demo-card-title>
<demo-progress value="${Math.round((learned / count) * 100)}" aria-label="Выучено"><demo-progress-track><demo-progress-indicator></demo-progress-indicator></demo-progress-track></demo-progress>
</demo-card-content>
<demo-card-footer>
<demo-avatar size="x-small"><demo-avatar-fallback>ЕГ</demo-avatar-fallback></demo-avatar>
<span class="sb-caption" style="flex: 1">${learned} из ${count} выучено</span>
${button('Учить', 'size="small"')}
</demo-card-footer>
</demo-card>`;
}

const markup = invite('data-story-target');

const meta: Meta<Props> = {
    title: 'Display/Card',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(`<div class="sb-narrow">${markup}</div>`, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Карточка: поверхность `bg-1` с тонкой рамкой; блок содержимого и подвал с действиями. Рамка светлеет при наведении. Заголовок — `as-child` с нужным уровнем `<h*>`.'
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
            section('Призыв к действию', 'Заголовок, описание и кнопки в подвале.', `<div class="sb-narrow">${invite()}</div>`) +
                section(
                    'Сетка наборов',
                    'Одинаковые отступы и подвал прижат к низу при разной высоте заголовков.',
                    grid(
                        setCard('Экзамен Законы UX', 32, 20) +
                            setCard('JavaScript: замыкания, контекст и прототипы', 18, 4) +
                            setCard('Английский B2', 120, 120),
                        240
                    )
                )
        )
};
