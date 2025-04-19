'use client';

import * as React from 'react';
import { useAnimationFinished } from './useAnimationFinished';
import { useEventCallback } from './useEventCallback';
import { useLatestRef } from './useLatestRef';

type TUseOpenChangeCompleteParameters = {
  enabled: boolean;
  ref: React.RefObject<HTMLElement | null>;
  onComplete: ()=> void;
  open?: boolean;
};

export function useOpenChangeComplete(params: TUseOpenChangeCompleteParameters) {
  const { enabled = true, open, ref, onComplete: onCompleteParam } = params;

  const openRef = useLatestRef(open);
  const onComplete = useEventCallback(onCompleteParam);
  const runOnAnimationFinished = useAnimationFinished(ref, open);

  React.useEffect(() => {
    if (!enabled)
      return;

    runOnAnimationFinished(() => {
      if (open === openRef.current)
        onComplete();
    });
  }, [open, enabled, onComplete, runOnAnimationFinished, openRef]);
}
