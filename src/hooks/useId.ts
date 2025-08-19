'use client';
import React from 'react';

/**
 *
 * @example <div id={useId()} />
 * @param idOverride
 * @returns {string}
 */
export function useId(idOverride?: string, prefix?: string): string | undefined {
    const reactId = React.useId();

    return idOverride ?? (prefix ? `${prefix}-${reactId}` : reactId);
}
