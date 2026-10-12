import type React from 'react';

/**
 * Children of a popup root as a function of the active trigger's payload.
 */
export type PayloadChildRenderFunction<Payload> = (arg: { payload: Payload | undefined }) => React.ReactNode;
