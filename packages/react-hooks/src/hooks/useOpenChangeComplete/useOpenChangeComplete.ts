import React from 'react';

import { useAnimationsFinished } from '../useAnimationsFinished';
import { useStableCallback } from '../useStableCallback';

type TUseOpenChangeCompleteParameters = {
    ref: React.RefObject<HTMLElement | null>;
    onComplete: () => void;
    enabled?: boolean;
    open?: boolean;
};

export function useOpenChangeComplete(params: TUseOpenChangeCompleteParameters) {
    const {
        enabled = true,
        open,
        ref,
        onComplete: onCompleteParam
    } = params;

    const onComplete = useStableCallback(onCompleteParam);
    const runOnceAnimationsFinish = useAnimationsFinished(ref, open, false);

    React.useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        const abortController = new AbortController();

        runOnceAnimationsFinish(onComplete, abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [enabled, open, onComplete, runOnceAnimationsFinish]);
}
