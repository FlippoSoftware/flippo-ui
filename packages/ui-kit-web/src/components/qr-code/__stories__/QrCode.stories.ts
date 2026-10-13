import { qrCode as recipe } from '@flippo-software/component-styles/qr-code';
import QRCodeStyling from 'qr-code-styling';

import type { Meta, StoryObj } from '@storybook/web-components';
import type { Options } from 'qr-code-styling';

import { icon, page, renderExample, row, section, variantControls } from '~@stories';

import type { QrCodeElement } from '~@src';
import type { VariantProps } from '~@stories';

type Props = VariantProps<typeof recipe> & { value?: string; size?: number };

const SET_URL = 'https://flippo.app/s/ux-laws-exam';

function share(attributes = '', options: { actions?: boolean; overlay?: string } = {}): string {
    const { actions = true, overlay } = options;
    const buttons = actions
        ? `<demo-qr-code-actions><demo-qr-code-download-trigger as-child><button type="button">${icon('arrow-outward')}Скачать</button></demo-qr-code-download-trigger><demo-qr-code-clipboard-trigger as-child><button type="button">${icon('copy')}Копировать</button></demo-qr-code-clipboard-trigger></demo-qr-code-actions>`
        : '';
    return `<demo-qr-code value="${SET_URL}" ${attributes}><demo-qr-code-frame></demo-qr-code-frame>${overlay ? `<demo-qr-code-overlay>${overlay}</demo-qr-code-overlay>` : ''}${buttons}</demo-qr-code>`;
}

/**
 * `createRenderer` draws the code (here with `qr-code-styling`, a Storybook-only dependency); it must be set before
 * the element generates. A renderer that throws shows the error state.
 */
function setRenderers(root: HTMLElement): void {
    for (const qr of root.querySelectorAll<QrCodeElement>('demo-qr-code')) {
        qr.createRenderer = qr.hasAttribute('data-fail')
            ? () => {
                  throw new Error('offline');
              }
            : (options) => new QRCodeStyling(options as Options);
    }
}

const failed = `<span style="display: grid; justify-items: center; gap: 8px">${icon('circle-xmark-fill')}Не удалось создать код</span>`;

const markup = share('data-story-target size="200"');

const meta: Meta<Props> = {
    title: 'Display/QrCode',
    args: {},
    argTypes: { ...variantControls(recipe), size: { control: { type: 'range', min: 120, max: 320, step: 20 } } },
    render: (args: Props) => renderExample(markup, args, setRenderers),
    parameters: {
        docs: {
            source: { code: markup, language: 'html' },
            description: {
                component:
                    'QR-код набора: рисуется цветом `--fl-qr-code-color` на прозрачном фоне и следует за темой; уголки-видоискатель вокруг кода. Если создать код не вышло — поверх матовая подложка (`demo-qr-code-overlay`). `createRenderer` задаётся до подключения элемента.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};

const BRAND = '--fl-qr-code-color: var(--fl-color-brand-light); --fl-qr-code-corner-color: var(--fl-color-brand-light-subtle)';

export const Gallery: Story = {
    render: () =>
        page(
            section('Размеры', '', row('size', share('size="120"', { actions: false }) + share('size="180"', { actions: false }))) +
                section(
                    'Ошибка',
                    'Рендерер бросил исключение: код не создан, поверх — сообщение.',
                    row('error', share('size="160" data-fail', { overlay: failed }))
                ) +
                section(
                    'Свой цвет',
                    'Цвет кода и уголков задаётся токенами `--fl-qr-code-color` и `--fl-qr-code-corner-color`.',
                    row('brand', share(`size="140" style="${BRAND}"`, { actions: false }))
                ),
            setRenderers
        )
};
