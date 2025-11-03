import React from 'react';

import { useClipboard, useEventCallback } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';
import { mergeProps } from '~@lib/merge';

import type { HeadlessUIComponentProps, HTMLProps, NativeButtonProps } from '~@lib/types';

import { useCompositeListContext } from '../../Composite/list/CompositeListContext';
import { useButton } from '../../use-button';
import { useSnippetRootContext } from '../root/SnippetRootContext';

/**
 * Button to copy snippet content to clipboard.
 * Renders a `<button>` element.
 */
export function SnippetCopyButton(componentProps: SnippetCopyButton.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        nativeButton,
        disabled: disabledProp,
        onCopy: onCopyProp,
        onCopyError: onCopyErrorProp,
        resetDelay = 2000,
        ...elementProps
    } = componentProps;

    const onCopy = useEventCallback(onCopyProp);
    const onCopyError = useEventCallback(onCopyErrorProp);
    const {
        copy,
        copied
    } = useClipboard({ timeout: resetDelay });

    const { elementsRef } = useCompositeListContext();
    const { disableCopy, metadataMapRef } = useSnippetRootContext();

    const disabled = Boolean(disableCopy || disabledProp || copied);

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

    const getCopyButtonProps = React.useCallback(
        (externalProps?: HTMLProps): HTMLProps => {
            return mergeProps(
                {
                    onClick: async () => {
                        if (disabled) {
                            return;
                        }

                        try {
                            const textToCopy = elementsRef.current
                                .map((element) => {
                                    if (!element)
                                        return null;
                                    const metadata = metadataMapRef.current?.get(element);
                                    return metadata ?? null;
                                })
                                .filter(Boolean)
                                .join('\n');

                            copy(textToCopy);
                            onCopy?.(textToCopy);
                        }
                        catch (error) {
                            onCopyError?.(error);
                        }
                    }
                },
                externalProps,
                getButtonProps
            );
        },
        [
            getButtonProps,
            disabled,
            copy,
            onCopy,
            onCopyError,
            elementsRef,
            metadataMapRef
        ]
    );

    const state: SnippetCopyButton.State = React.useMemo(
        () => ({
            disabled,
            copied
        }),
        [disabled, copied]
    );

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, buttonRef],
        props: [elementProps, getCopyButtonProps]
    });

    return element;
}

export namespace SnippetCopyButton {
    export type State = {
        disabled: boolean;
        copied: boolean;
    };

    export type Props = {
        /**
         * Whether the component should ignore user interaction.
         * @default false
         */
        disabled?: boolean;

        /**
         * Time in milliseconds before resetting the copy status to idle.
         * @default 2000
         */
        resetDelay?: number;

        /**
         * Callback fired when the content is successfully copied.
         */
        onCopy?: (value: string) => void;

        /**
         * Callback fired when copying fails.
         */
        onCopyError?: (error: unknown) => void;
    } & NativeButtonProps & HeadlessUIComponentProps<'button', State>;
}
