import React from 'react';

import { createRenderer, screen, waitFor } from '@flippo-software/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Snippet } from '.';

describe.each(RENDER_MODES)('Snippet ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    function TestSnippet(props: Partial<Snippet.Root.Props> & Partial<Snippet.CopyButton.Props>) {
        const { disabled, onCopy, resetDelay, ...rootProps } = props;
        return (
            <Snippet.Root data-testid='root' {...rootProps}>
                <Snippet.Line value='npm install'>
                    <Snippet.Symbol data-testid='symbol' />
                    npm install
                </Snippet.Line>
                <Snippet.Line value={undefined}>
                    <Snippet.Symbol />
                    <span>npm test</span>
                </Snippet.Line>
                <Snippet.CopyButton disabled={disabled} onCopy={onCopy} resetDelay={resetDelay}>
                    Copy
                </Snippet.CopyButton>
            </Snippet.Root>
        );
    }

    it('renders the lines with the prompt symbol', () => {
        render(<TestSnippet symbol='>' />);
        expect(screen.getByTestId('symbol')).toHaveTextContent('>');
        expect(screen.getByTestId('symbol')).toHaveAttribute('data-snippet-symbol', '');
        expect(screen.getAllByText(/npm/)[0]?.tagName).toBe('PRE');
    });

    it('copies all lines without their symbols', async () => {
        const onCopy = vi.fn();
        const { user } = render(<TestSnippet onCopy={onCopy} />);
        const writeText = vi.spyOn(navigator.clipboard, 'writeText');
        const button = screen.getByRole('button', { name: 'Copy' });
        await user.click(button);
        expect(onCopy).toHaveBeenCalledWith('npm install\nnpm test');
        expect(writeText).toHaveBeenCalledWith('npm install\nnpm test');
        await waitFor(() => expect(button).toHaveAttribute('data-copied', ''));
        expect(button).toBeDisabled();
    });

    it('does not copy when copying is disabled', async () => {
        const onCopy = vi.fn();
        const { user } = render(<TestSnippet disableCopy={true} onCopy={onCopy} />);
        expect(screen.getByTestId('root')).toHaveAttribute('data-disable-copy', '');
        await user.click(screen.getByRole('button', { name: 'Copy' }));
        expect(onCopy).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Copy' })).toBeDisabled();
    });
});
