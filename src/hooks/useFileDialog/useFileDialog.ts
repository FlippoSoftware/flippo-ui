import React from 'react';

import { useEventCallback } from '../useEventCallback';
import { useIsoLayoutEffect } from '../useIsoLayoutEffect';
import { useValueAsRef } from '../useValueAsRef';

export type UseFileDialogOptions = {
    /** Determines whether multiple files are allowed, `true` by default */
    multiple?: boolean;

    /** `accept` attribute of the file input, '*' by default */
    accept?: string;

    /** `capture` attribute of the file input */
    capture?: string;

    /** Determines whether the user can pick a directory instead of file, `false` by default */
    directory?: boolean;

    /** Determines whether the file input state should be reset when the file dialog is opened, `false` by default */
    resetOnOpen?: boolean;

    /** Initial selected files */
    initialFiles?: FileList | File[];

    /** Called when files are selected */
    onChange?: (files: FileList | null) => void;

    /** Called when file dialog is canceled */
    onCancel?: () => void;
};

const defaultOptions: UseFileDialogOptions = {
    multiple: true,
    accept: '*'
};

function getInitialFilesList(files: UseFileDialogOptions['initialFiles']): FileList | null {
    if (!files) {
        return null;
    }

    if (files instanceof FileList) {
        return files;
    }

    const result = new DataTransfer();
    for (const file of files) {
        result.items.add(file);
    }

    return result.files;
}

function createInput(options: UseFileDialogOptions) {
    if (typeof document === 'undefined') {
        return null;
    }

    const input = document.createElement('input');
    input.type = 'file';

    if (options.accept) {
        input.accept = options.accept;
    }

    if (options.multiple) {
        input.multiple = options.multiple;
    }

    if (options.capture) {
        input.capture = options.capture;
    }

    if (options.directory) {
        input.webkitdirectory = options.directory;
    }

    input.style.display = 'none';
    return input;
}

export type UseFileDialogReturnValue = {
    files: FileList | null;
    open: () => void;
    reset: () => void;
};

export function useFileDialog(input: UseFileDialogOptions = {}): UseFileDialogReturnValue {
    const options = useValueAsRef<UseFileDialogOptions>({ ...defaultOptions, ...input });

    const [files, setFiles] = React.useState<FileList | null>(() => getInitialFilesList(options.current.initialFiles));
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const createAndSetupInput = useEventCallback(() => {
        inputRef.current?.remove();
        inputRef.current = createInput(options.current);

        if (inputRef.current) {
            const handleChange
                = (event: Event) => {
                    const target = event.target as HTMLInputElement;
                    if (target?.files) {
                        setFiles(target.files);
                        options.current.onChange?.(target.files);
                    }
                };

            inputRef.current.addEventListener('change', handleChange, { once: true });
            document.body.appendChild(inputRef.current);
        }
    });

    useIsoLayoutEffect(() => {
        createAndSetupInput();
        return () => inputRef.current?.remove();
    }, []);

    const reset = useEventCallback(() => {
        setFiles(null);
        options.current.onChange?.(null);
    });

    const open = useEventCallback(() => {
        if (options.current.resetOnOpen) {
            reset();
        }

        createAndSetupInput();
        inputRef.current?.click();
    });

    return { files, open, reset };
}
