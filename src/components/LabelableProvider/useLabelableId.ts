import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';
import { isElement } from '@floating-ui/utils/dom';

import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { NOOP } from '~@lib/noop';

import { useLabelableContext } from './LabelableContext';

export function useLabelableId(params: useLabelableId.Parameters = {}) {
    const { id, implicit = false, controlRef } = params;
    const { controlId, setControlId } = useLabelableContext();
    const defaultId = useHeadlessUiId(id);

    useIsoLayoutEffect(() => {
        if ((!implicit && !id) || setControlId === NOOP) {
            return undefined;
        }

        if (implicit) {
            const elem = controlRef?.current;

            if (isElement(elem) && elem.closest('label') != null) {
                setControlId(id ?? null);
            }
            else {
                setControlId(controlId ?? defaultId);
            }
        }
        else if (id) {
            setControlId(id);
        }

        return () => {
            if (id) {
                setControlId(undefined);
            }
        };
    }, [
        id,
        controlRef,
        controlId,
        setControlId,
        implicit,
        defaultId
    ]);

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
