import { useIsoLayoutEffect } from '@flippo-software/hooks/use-iso-layout-effect';

import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';

import { useLabelableContext } from './LabelableContext';

/**
 * Registers the id of a labelable control (explicit `id`, or implicit labelling by a wrapping `<label>`)
 * and returns the id to use.
 */
export function useLabelableId(params: useLabelableId.Parameters = {}) {
    const { id, implicit = false, controlRef } = params;

    const { controlId, labelable } = useLabelableContext();
    const defaultId = useHeadlessUiId(id) as string;

    useIsoLayoutEffect(
        () => labelable?.registerControl({ id, implicit, controlElement: controlRef?.current, defaultId }),
        // `controlId` is a dependency: implicit labelling keeps the current id.
        [id, controlRef, controlId, labelable, implicit, defaultId]
    );

    return controlId ?? defaultId;
}

export namespace useLabelableId {
    export type Parameters = {
        id?: string | undefined;
        /**
         * Whether implicit labelling is supported.
         * @default false
         */
        implicit?: boolean;
        /**
         * A ref to an element that can be implicitly labelled.
         */
        controlRef?: React.RefObject<HTMLElement | null>;
    };

    export type ReturnValue = string;
}
