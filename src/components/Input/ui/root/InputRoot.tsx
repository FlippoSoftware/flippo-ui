import React from 'react';

import { Input as InputHeadless } from '@flippo-ui/headless-components/input';

export function InputRoot(props: InputRoot.Props) {
    return (
        <InputHeadless {...props} />
    );
}

export namespace InputRoot {
    export type Props = InputHeadless.Props;
}
