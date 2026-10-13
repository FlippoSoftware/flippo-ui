import { toast as recipe } from '@flippo-software/component-styles/toast';

import type { IconName } from '@flippo-software/component-styles/icons';
import type { Meta, StoryObj } from '@storybook/web-components';

import { button, icon, page, renderExample, row, section, variantControls } from '~@stories';

import type { ToastProviderElement } from '~@src';
import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe>;

const TYPE_ICONS: Record<string, IconName> = {
    success: 'circle-check-fill',
    warning: 'circle-info-fill',
    error: 'circle-xmark-fill',
    like: 'favorite-fill',
    info: 'circle-info-fill'
};

/** The viewport copies the template for each toast; the icon follows the toast's `data-type`. */
function stage(triggers: string, toastAttributes = ''): string {
    return `<demo-toast-provider>
${triggers}
<demo-toast-viewport><template>
<demo-toast ${toastAttributes}><demo-toast-icon></demo-toast-icon><demo-toast-content><demo-toast-title></demo-toast-title><demo-toast-description></demo-toast-description></demo-toast-content><demo-toast-action></demo-toast-action><demo-toast-close aria-label="Закрыть уведомление"></demo-toast-close></demo-toast>
</template></demo-toast-viewport>
</demo-toast-provider>`;
}

/** Fills the icon of each new toast by its type (a spinner while a promise is pending). */
function syncIcons(root: HTMLElement): void {
    const update = () => {
        for (const toast of root.querySelectorAll('demo-toast')) {
            const type = toast.getAttribute('data-type') ?? 'info';
            const iconElement = toast.querySelector('demo-toast-icon');
            if (!iconElement || iconElement.getAttribute('data-icon') === type) continue;
            iconElement.setAttribute('data-icon', type);
            iconElement.innerHTML =
                type === 'loading'
                    ? '<demo-spinner size="x-small" color="current" aria-hidden="true"></demo-spinner>'
                    : icon(TYPE_ICONS[type] ?? 'circle-info-fill');
        }
    };
    new MutationObserver(update).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-type'] });
}

function wire(root: HTMLElement): void {
    syncIcons(root);
    const provider = root.querySelector<ToastProviderElement>('demo-toast-provider');
    if (!provider) return;
    const actions: Record<string, () => void> = {
        default: () => provider.add({ type: 'success', title: 'Изменения сохранены', description: 'Набор обновлён у всех участников.' }),
        success: () => provider.add({ type: 'success', title: 'Набор сохранён' }),
        info: () => provider.add({ type: 'info', title: 'Ссылка скопирована' }),
        warning: () => provider.add({ type: 'warning', title: 'Нет сети', description: 'Изменения сохранятся позже.' }),
        error: () => provider.add({ type: 'error', title: 'Не удалось удалить', description: 'Попробуйте ещё раз.' }),
        like: () => provider.add({ type: 'like', title: 'Добавлено в избранное' }),
        undo: () => {
            const id = provider.add({
                title: 'Карточка удалена',
                actionProps: { children: 'Отменить', onClick: () => provider.close(id) }
            });
        },
        promise: () => {
            provider.promise(new Promise((resolve) => setTimeout(resolve, 1600)), {
                loading: { title: 'Публикуем набор…' },
                success: { title: 'Набор опубликован' },
                error: { title: 'Ошибка публикации' }
            });
        }
    };
    root.addEventListener('click', (event) => {
        const trigger = (event.target as Element).closest<HTMLElement>('[data-toast]');
        if (trigger) actions[trigger.dataset.toast ?? 'default']?.();
    });
}

const markup = stage(button('Показать уведомление', 'data-toast="default"'), 'data-story-target');

const trigger = (kind: string, content: string, variant = 'secondary') =>
    `<demo-button variant="${variant}" as-child><button type="button" data-toast="${kind}">${content}</button></demo-button>`;

const triggers =
    row(
        'types',
        trigger('success', 'Успех') +
            trigger('info', 'Инфо') +
            trigger('warning', 'Предупреждение') +
            trigger('error', 'Ошибка') +
            trigger('like', 'Лайк')
    ) +
    row('action', trigger('undo', `${icon('delete')}Удалить с отменой`, 'danger')) +
    row('promise', trigger('promise', 'Опубликовать', 'primary'));

const meta: Meta<Props> = {
    title: 'Feedback/Toast',
    args: {},
    argTypes: variantControls(recipe),
    render: (args: Props) => renderExample(markup, args, wire),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'Уведомления (Figma "Toast") внизу экрана: `provider.add({ type, title, description, actionProps })` и `provider.promise()`. `type` красит иконку, warning и error — ещё и текст. Тосты складываются стопкой и раскрываются при наведении; смахиваются жестом.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

export const Gallery: Story = {
    render: () =>
        page(section('Типы, действие и промис', 'Нажмите несколько кнопок подряд — тосты сложатся в стопку.', stage(triggers)), wire)
};
