import React from 'react';

function transformValue(text: string) {
    // Manually replace all &nbsp; to avoid get different unicode characters;
    return text.replace(/\u00A0/g, ' ');
}

/**
 * Copies the given text to the clipboard.
 * @param params - parameters object
 * @param params.timeout - timeout in ms, default 2000
 * @returns {copy, copied, error, reset} - copy function, copied state, error state, reset function
 */
export function useClipboard(params: UseClipboard.Params) {
    const { timeout = 2000 } = params;

    const [error, setError] = React.useState<Error | null>(null);
    const [copied, setCopied] = React.useState(false);
    const [copyTimeout, setCopyTimeout] = React.useState<ReturnType<typeof setTimeout> | null>(null);

    const onClearTimeout = React.useCallback(() => {
        if (copyTimeout) {
            clearTimeout(copyTimeout);
        }
    }, [copyTimeout]);

    const handleCopyResult = React.useCallback(
        (value: boolean) => {
            onClearTimeout();
            setCopyTimeout(setTimeout(() => setCopied(false), timeout));
            setCopied(value);
        },
        [onClearTimeout, timeout]
    );

    const copy = React.useCallback(
        (valueToCopy: any) => {
            if ('clipboard' in navigator) {
                const transformedValue
                    = typeof valueToCopy === 'string' ? transformValue(valueToCopy) : valueToCopy;

                navigator.clipboard
                    .writeText(transformedValue)
                    .then(() => handleCopyResult(true))
                    .catch((err) => setError(err));
            }
            else {
                setError(new Error('useClipboard: navigator.clipboard is not supported'));
            }
        },
        [handleCopyResult]
    );

    const reset = React.useCallback(() => {
        setCopied(false);
        setError(null);
        onClearTimeout();
    }, [onClearTimeout]);

    return {
        copy,
        reset,
        error,
        copied
    };
}

export namespace UseClipboard {
    export type Params = {
        /**
         * The time in milliseconds to wait before resetting the clipboard.
         * @default 2000
         */
        timeout?: number;
    };

    export type Return = ReturnType<typeof useClipboard>;
}
