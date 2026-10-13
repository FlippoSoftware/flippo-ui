import { useStableCallback } from '../useStableCallback';

export type EyeDropperOpenOptions = {
    signal?: AbortSignal;
};

export type EyeDropperOpenReturnType = {
    sRGBHex: string;
};

export type UseEyeDropperReturnValue = {
    isSupported: boolean;
    open: (options?: EyeDropperOpenOptions) => Promise<EyeDropperOpenReturnType | undefined>;
};

const isSupported = typeof window !== 'undefined' && !isOpera() && 'EyeDropper' in window;

export function useEyeDropper(): UseEyeDropperReturnValue {
    const open = useStableCallback(
        (options: EyeDropperOpenOptions = {}): Promise<EyeDropperOpenReturnType | undefined> => {
            if (isSupported) {
                const eyeDropper = new (window as any).EyeDropper();
                return eyeDropper.open(options);
            }

            return Promise.resolve(undefined);
        }
    );

    return { isSupported, open };
}

function isOpera() {
    return navigator.userAgent.includes('OPR');
}
