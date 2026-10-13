import React from 'react';

import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useWindowEvent } from '../useWindowEvent';

export type UseHashReturnValue = [string, (value: string) => void];
export type UseHashParams = {
    getInitialValueInEffect?: boolean;
};

export function useHash({
    getInitialValueInEffect = true
}: UseHashParams = {}): UseHashReturnValue {
    const [hash, setHash] = React.useState<string>(
        getInitialValueInEffect ? '' : window.location.hash || ''
    );

    const setHashHandler = (value: string) => {
        const valueWithHash = value.startsWith('#') ? value : `#${value}`;
        window.location.hash = valueWithHash;
        setHash(valueWithHash);
    };

    useWindowEvent('hashchange', () => {
        const newHash = window.location.hash;
        if (hash !== newHash) {
            setHash(newHash);
        }
    });

    useIsoLayoutEffect(() => {
        if (getInitialValueInEffect) {
            setHash(window.location.hash);
        }
    }, []);

    return [hash, setHashHandler];
}
