import React from 'react';

import { useAnimationsFinished } from '../useAnimationsFinished';
import { useEventCallback } from '../useEventCallback';
import { useLatestRef } from '../useLatestRef';

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

    const openRef = useLatestRef(open);
    const onComplete = useEventCallback(onCompleteParam);
    const runOnAnimationFinished = useAnimationsFinished(ref, open);

    React.useEffect(() => {
        if (!enabled)
            return;

        runOnAnimationFinished(() => {
            if (open === openRef.current)
                onComplete();
        });
    }, [
        open,
        enabled,
        onComplete,
        runOnAnimationFinished,
        openRef
    ]);
}
