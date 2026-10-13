import type { RefObject } from 'react';

export const targetSymbol = Symbol('target');

export type Target = (() => Element) | string | Document | Element | Window;
type BrowserTarget = {
    type: symbol;
    value: Target;
};
type StateRef<Value> = {
    (node: Value): void;
    current: Value;
    state: Value;
};

export type HookTarget
    = | BrowserTarget
      | RefObject<Element | null | undefined>
      | StateRef<Element | null | undefined>;

export function target(target: Target) {
    return {
        value: target,
        type: targetSymbol
    };
}

export const isRef = (target: HookTarget) => typeof target === 'object' && 'current' in target;

export function isRefState(target: HookTarget) {
    return typeof target === 'function' && 'state' in target && 'current' in target;
}

export function isBrowserTarget(target: HookTarget) {
    return typeof target === 'object'
      && target
      && 'type' in target
      && target.type === targetSymbol
      && 'value' in target;
}

export function isTarget(target: HookTarget) {
    return isRef(target) || isRefState(target) || isBrowserTarget(target);
}

function getElement(target: HookTarget) {
    if ('current' in target) {
        return target.current;
    }

    if (typeof target.value === 'function') {
        return target.value();
    }

    if (typeof target.value === 'string') {
        return document.querySelector(target.value);
    }

    if (target.value instanceof Document) {
        return target.value;
    }

    if (target.value instanceof Window) {
        return target.value;
    }

    if (target.value instanceof Element) {
        return target.value;
    }

    return target.value;
}
export const getRefState = (target?: HookTarget) => target && 'state' in target && target.state;
export function getRawElement(target: HookTarget) {
    if (isRefState(target))
        return target.state;
    if (isBrowserTarget(target))
        return (target as BrowserTarget).value;

    return target;
}

isTarget.wrap = target;
isTarget.getElement = getElement;
isTarget.getRefState = getRefState;
isTarget.getRawElement = getRawElement;
