

import React from 'react';

function noop() {}

export const useIsoLayoutEffect = typeof document !== 'undefined' ? React.useLayoutEffect : noop;
