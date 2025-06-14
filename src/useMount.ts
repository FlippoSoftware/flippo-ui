import * as React from 'react';

export function useMount(effectCallback: React.EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(effectCallback, []);
}
