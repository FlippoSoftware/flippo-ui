import React from 'react';

function noop() {}

/** `useLayoutEffect` in the browser, nothing on the server (where layout effects warn and never run). */
export const useIsoLayoutEffect = typeof document !== 'undefined' ? React.useLayoutEffect : noop;
