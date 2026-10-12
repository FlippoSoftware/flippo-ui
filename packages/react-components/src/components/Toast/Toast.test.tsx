import React from 'react';

import { act, createRenderer, screen, waitFor } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Toast } from '.';

describe.each(RENDER_MODES)('Toast ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function ToastList() {
        const { toasts } = Toast.useToastManager();
        return toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast} data-testid='toast'>
                <Toast.Title data-testid='title' />
                <Toast.Description data-testid='description' />
                <Toast.Action data-testid='action' />
                <Toast.Close aria-label='Dismiss'>x</Toast.Close>
            </Toast.Root>
        ));
    }

    function AddButton(props: { options?: Parameters<ReturnType<typeof Toast.useToastManager>['add']>[0] }) {
        const manager = Toast.useToastManager();
        return (
            <button type='button' onClick={() => manager.add(props.options ?? { title: 'Saved', description: 'All changes saved' })}>
                Add
            </button>
        );
    }

    function TestToasts(props: Partial<Toast.Provider.Props> & { options?: Parameters<typeof AddButton>[0]['options'] }) {
        const { options, ...providerProps } = props;
        return (
            <Toast.Provider {...providerProps}>
                <AddButton options={options} />
                <Toast.Portal>
                    <Toast.Viewport data-testid='viewport'>
                        <ToastList />
                    </Toast.Viewport>
                </Toast.Portal>
            </Toast.Provider>
        );
    }

    it('adds a toast with its title and description', async () => {
        const { user } = render(<TestToasts />);
        await user.click(screen.getByRole('button', { name: 'Add' }));
        const toast = await screen.findByTestId('toast');
        expect(screen.getByTestId('title')).toHaveTextContent('Saved');
        expect(screen.getByTestId('description')).toHaveTextContent('All changes saved');
        expect(toast).toHaveAttribute('aria-labelledby', screen.getByTestId('title').id);
        expect(toast).toHaveAttribute('aria-describedby', screen.getByTestId('description').id);
        expect(screen.getByTestId('viewport')).toContainElement(toast);
    });

    it('closes with the close button', async () => {
        const onClose = vi.fn();
        const { user } = render(<TestToasts options={{ title: 'Hi', onClose }} />);
        await user.click(screen.getByRole('button', { name: 'Add' }));
        await screen.findByTestId('toast');
        // The close button is hidden from assistive technology until the viewport is focused.
        await user.click(screen.getByText('x'));
        expect(onClose).toHaveBeenCalled();
        await waitFor(() => expect(screen.queryByTestId('toast')).toBeNull());
    });

    it('dismisses automatically after the timeout', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        try {
            const { user } = render(<TestToasts timeout={1000} />);
            await user.click(screen.getByRole('button', { name: 'Add' }));
            await screen.findByTestId('toast');
            await act(async () => {
                vi.advanceTimersByTime(1500);
            });
            await waitFor(() => expect(screen.queryByTestId('toast')).toBeNull());
        } finally {
            vi.useRealTimers();
        }
    });

    it('renders the action with its props', async () => {
        const onClick = vi.fn();
        const { user } = render(<TestToasts options={{ title: 'Deleted', actionProps: { children: 'Undo', onClick } }} />);
        await user.click(screen.getByRole('button', { name: 'Add' }));
        await user.click(await screen.findByRole('button', { name: 'Undo', hidden: true }));
        expect(onClick).toHaveBeenCalled();
    });

    it('limits the number of visible toasts', async () => {
        const { user } = render(<TestToasts limit={2} />);
        const add = screen.getByRole('button', { name: 'Add' });
        await user.click(add);
        await user.click(add);
        await user.click(add);
        await waitFor(() => expect(screen.getAllByTestId('toast')).toHaveLength(3));
        const limited = screen.getAllByTestId('toast').filter((toast) => toast.hasAttribute('data-limited'));
        expect(limited).toHaveLength(1);
    });

    it('adds toasts from an external manager', async () => {
        const toastManager = Toast.createToastManager();
        render(<TestToasts toastManager={toastManager} />);
        act(() => {
            toastManager.add({ title: 'From outside' });
        });
        expect(await screen.findByTestId('title')).toHaveTextContent('From outside');
    });

    it('updates a toast from a promise', async () => {
        let resolve: (value: string) => void = () => {};
        function PromiseButton() {
            const manager = Toast.useToastManager();
            return (
                <button
                    type='button'
                    onClick={() => {
                        manager.promise(new Promise<string>((r) => (resolve = r)), {
                            loading: 'Loading…',
                            success: (value: string) => `Done: ${value}`,
                            error: 'Failed'
                        });
                    }}
                >
                    Run
                </button>
            );
        }
        const { user } = render(
            <Toast.Provider>
                <PromiseButton />
                <Toast.Portal>
                    <Toast.Viewport>
                        <ToastList />
                    </Toast.Viewport>
                </Toast.Portal>
            </Toast.Provider>
        );
        await user.click(screen.getByRole('button', { name: 'Run' }));
        expect(await screen.findByTestId('toast')).toHaveTextContent('Loading…');
        await act(async () => {
            resolve('ok');
        });
        await waitFor(() => expect(screen.getByTestId('toast')).toHaveTextContent('Done: ok'));
    });
});
