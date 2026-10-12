import React from 'react';

import { LabelableController } from '@flippo-software/core-components/labelable';
import { Store } from '@flippo-software/core-components/store';

import { useStoreState } from '~@lib/core';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';

import type { HTMLProps } from '~@lib/types';

import { LabelableContext, useLabelableContext } from './LabelableContext';

import type { LabelableContextValue } from './LabelableContext';

const NO_PARENT_STORE = new Store({});

/**
 * Associates a labelable control with its label and descriptions (core `LabelableController`).
 */
export function LabelableProvider(props: LabelableProvider.Props) {
    const defaultId = useHeadlessUiId() as string;
    const parent = useLabelableContext().labelable ?? null;

    const [labelable] = React.useState(() => new LabelableController(defaultId, parent, props.initialControlId));
    const state = useStoreState(labelable.store);
    // Descriptions of the enclosing provider are part of `aria-describedby`.
    const parentState = useStoreState(parent?.store ?? NO_PARENT_STORE);

    // Stable setters (effects of the parts depend on them); they accept updater functions like `setState`.
    const [setters] = React.useState(() => ({
        setControlId: ((update) =>
            labelable.setControlId(
                typeof update === 'function' ? update(labelable.controlId) : update
            )) as LabelableContextValue['setControlId'],
        setLabelId: ((update) =>
            labelable.setLabelId(typeof update === 'function' ? update(labelable.labelId) : update)) as LabelableContextValue['setLabelId']
    }));

    // biome-ignore lint/correctness/useExhaustiveDependencies: `parentState` changes `getDescriptionProps` output.
    const contextValue: LabelableContextValue = React.useMemo(
        () => ({
            controlId: state.controlId,
            setControlId: setters.setControlId,
            labelId: state.labelId,
            setLabelId: setters.setLabelId,
            messageIds: state.messageIds,
            setMessageIds: labelable.setMessageIds,
            getDescriptionProps: labelable.getDescriptionProps as (externalProps: HTMLProps) => HTMLProps,
            labelable
        }),
        [state, parentState, labelable, setters]
    );

    return <LabelableContext.Provider value={contextValue}>{props.children}</LabelableContext.Provider>;
}

export namespace LabelableProvider {
    export type Props = {
        initialControlId?: string | null | undefined;
        children?: React.ReactNode;
    };
}
