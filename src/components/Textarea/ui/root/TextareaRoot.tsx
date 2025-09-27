import React from 'react';

import { Textarea as TextareaHeadless } from '@flippo-ui/headless-components/textarea';

export function TextareaRoot(props: TextareaRoot.Props) {
    return <TextareaHeadless {...props} />;
}

export namespace TextareaRoot {
    export type Props = TextareaHeadless.Props;
}
