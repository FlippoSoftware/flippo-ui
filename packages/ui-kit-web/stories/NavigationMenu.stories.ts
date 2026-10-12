import { navigationMenu as recipe } from '@flippo-software/component-styles/navigation-menu';

import type { Meta, StoryObj } from '@storybook/web-components';

import { renderExample, variantControls } from './helpers';
import { page, section } from './kit';

import type { VariantProps } from './helpers';

type Props = VariantProps<typeof recipe>;

function link(href: string, title: string, description: string): string {
    return `<demo-navigation-menu-link as-child><a href="${href}">${title}<demo-navigation-menu-link-description>${description}</demo-navigation-menu-link-description></a></demo-navigation-menu-link>`;
}

function item(value: string, label: string, content: string): string {
    return `<demo-navigation-menu-item value="${value}"><demo-navigation-menu-trigger as-child><button type="button">${label}<demo-navigation-menu-icon></demo-navigation-menu-icon></button></demo-navigation-menu-trigger><demo-navigation-menu-content>${content}</demo-navigation-menu-content></demo-navigation-menu-item>`;
}

function site(attributes = ''): string {
    const learn = `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 220px)); gap: 4px">${
        link('#sets', 'Наборы', 'Карточки по темам от сообщества') +
        link('#repeat', 'Повторение', 'Интервальное повторение на сегодня') +
        link('#exam', 'Проверь себя', 'Тест по всем карточкам набора') +
        link('#stats', 'Статистика', 'Прогресс за неделю и месяц')
    }</div>`;
    const create = link('#new', 'Новый набор', 'С нуля или из шаблона') + link('#import', 'Импорт', 'Из CSV, Anki или Quizlet');
    return `<demo-navigation-menu ${attributes}>
<demo-navigation-menu-list>
${item('learn', 'Учиться', learn)}
${item('create', 'Создавать', create)}
<demo-navigation-menu-item><demo-navigation-menu-link as-child><a href="#community" class="fl-navigation-menu-trigger fl-interactive fl-focus-ring fl-text-body-minus-stronger">Сообщество</a></demo-navigation-menu-link></demo-navigation-menu-item>
</demo-navigation-menu-list>
<demo-navigation-menu-positioner><demo-navigation-menu-popup><demo-navigation-menu-viewport></demo-navigation-menu-viewport></demo-navigation-menu-popup></demo-navigation-menu-positioner>
</demo-navigation-menu>`;
}

const markup = site('data-story-target');

const meta: Meta<Props> = {
    title: 'Navigation/NavigationMenu',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component: 'Навигация сайта: панель меняет размер под содержимое и сдвигает его в сторону, откуда пришёл курсор.'
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
                'Главная навигация',
                'Наведите на «Учиться», затем на «Создавать»: панель подстраивает размер.',
                `<div style="min-height: 260px">${site()}</div>`
            )
        )
};
