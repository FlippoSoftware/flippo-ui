import { SnippetCopyButtonMachine } from '@flippo-software/core-components/snippet';

import { toReactProps, useMachine, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

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
        disabled,
        onCopy,
        onCopyError,
        resetDelay = 2000,
        ...elementProps
    } = componentProps;

    const { snippet } = useSnippetRootContext();

    const copyButton = useMachine((options) => new SnippetCopyButtonMachine(snippet, options), {
        disabled,
        resetDelay,
        onCopy,
        onCopyError,
        nativeButton
    });
    const state: SnippetCopyButton.State = useMachineState(copyButton);

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, copyButton.button.setElement],
        props: [elementProps, (props) => toReactProps(copyButton.getProps(props))]
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
    } & NativeButtonProps &
        HeadlessUIComponentProps<'button', State>;
}
