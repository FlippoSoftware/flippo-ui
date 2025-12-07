import * as REASONS from './reason-parts';

export { REASONS };
export type HeadlessUIEventReasons = typeof REASONS;
export type HeadlessUIEventReason = HeadlessUIEventReasons[keyof HeadlessUIEventReasons];
