import React from 'react';

import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { mergeProps } from '~@lib/merge';

import type { HTMLProps } from '~@lib/types';

import { LabelableContext, useLabelableContext } from './LabelableContext';

import type { LabelableContextValue } from './LabelableContext';

export function LabelableProvider(props: LabelableProvider.Props) {
    const defaultId = useHeadlessUiId();

    const [controlId, setControlId] = React.useState<string | null | undefined>(
        props.initialControlId === undefined ? defaultId : props.initialControlId
    );
    const [labelId, setLabelId] = React.useState<string | undefined>(undefined);
    const [messageIds, setMessageIds] = React.useState<string[]>([]);

    const { messageIds: parentMessageIds } = useLabelableContext();

    const getDescriptionProps = React.useCallback(
        (externalProps: HTMLProps) => {
            return mergeProps(
                { 'aria-describedby': parentMessageIds.concat(messageIds).join(' ') || undefined },
                externalProps
            );
        },
        [parentMessageIds, messageIds]
    );

    const contextValue: LabelableContextValue = React.useMemo(
        () => ({
            controlId,
            setControlId,
            labelId,
            setLabelId,
            messageIds,
            setMessageIds,
            getDescriptionProps
        }),
        [
            controlId,
            setControlId,
            labelId,
            setLabelId,
            messageIds,
            setMessageIds,
            getDescriptionProps
        ]
    );

    return (
        <LabelableContext.Provider value={contextValue}>{props.children}</LabelableContext.Provider>
    );
}

export namespace LabelableProvider {
    export type Props = {
        initialControlId?: string | null | undefined;
        children?: React.ReactNode;
    };
}
