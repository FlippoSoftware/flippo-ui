import React from 'react';

import { createRenderer, screen, waitFor } from '@flippo/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { QrCode } from '.';

const renderer = vi.hoisted(() => ({
    created: [] as Array<Record<string, unknown>>,
    download: vi.fn(async () => {})
}));

vi.mock('qr-code-styling', () => ({
    default: class {
        options: Record<string, unknown>;

        constructor(options: Record<string, unknown>) {
            this.options = options;
            renderer.created.push(options);
        }

        append(container: HTMLElement) {
            const code = document.createElement('svg');
            code.setAttribute('data-qr', String(this.options.data));
            container.append(code);
        }

        getRawData = async () => new Blob(['<svg />'], { type: 'image/svg+xml' });

        download = renderer.download;
    }
}));

describe.each(RENDER_MODES)('QrCode ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestQrCode(props: Partial<QrCode.Root.Props>) {
        return (
            <QrCode.Root data-testid='root' value='https://example.com' {...props}>
                <QrCode.Frame data-testid='frame' />
                <QrCode.GenerateTrigger>Generate</QrCode.GenerateTrigger>
                <QrCode.DownloadTrigger>Download</QrCode.DownloadTrigger>
            </QrCode.Root>
        );
    }

    it('generates on mount and appends the code to the frame', async () => {
        renderer.created.length = 0;
        const onGenerate = vi.fn();
        render(<TestQrCode size={120} onGenerate={onGenerate} />);
        await waitFor(() => expect(screen.getByTestId('root')).toHaveAttribute('data-status-generated', ''));
        expect(onGenerate).toHaveBeenCalled();
        expect(renderer.created.at(-1)).toMatchObject({ data: 'https://example.com', width: 120, height: 120 });
        expect(screen.getByTestId('root').style.getPropertyValue('--qr-code-width')).toBe('120px');
        await waitFor(() => expect(screen.getByTestId('frame').querySelector('[data-qr]')).not.toBeNull());
        expect(screen.getByRole('button', { name: 'Generate' })).toBeDisabled();
    });

    it('regenerates when the value changes', async () => {
        renderer.created.length = 0;
        const { rerender } = render(<TestQrCode />);
        await waitFor(() => expect(screen.getByTestId('root')).toHaveAttribute('data-status-generated', ''));
        rerender(<TestQrCode value='next' />);
        await waitFor(() => expect(renderer.created.at(-1)).toMatchObject({ data: 'next' }));
    });

    it('generates on demand without generateOnMount', async () => {
        renderer.created.length = 0;
        const { user } = render(<TestQrCode generateOnMount={false} />);
        expect(screen.getByTestId('root')).toHaveAttribute('data-status-idle', '');
        expect(renderer.created).toHaveLength(0);
        expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled();
        await user.click(screen.getByRole('button', { name: 'Generate' }));
        await waitFor(() => expect(screen.getByTestId('root')).toHaveAttribute('data-status-generated', ''));
    });

    it('downloads the generated code', async () => {
        renderer.download.mockClear();
        const { user } = render(<TestQrCode />);
        const download = screen.getByRole('button', { name: 'Download' });
        await waitFor(() => expect(download).not.toBeDisabled());
        await user.click(download);
        expect(renderer.download).toHaveBeenCalledWith({ name: 'qrcode', extension: 'svg' });
    });

    it('reports generation errors', async () => {
        const onError = vi.fn();
        const error = new Error('fail');
        render(
            <TestQrCode
                onGenerate={() => {
                    throw error;
                }}
                onError={onError}
            />
        );
        await waitFor(() => expect(screen.getByTestId('root')).toHaveAttribute('data-status-error', ''));
        expect(onError).toHaveBeenCalledWith(error);
    });
});
