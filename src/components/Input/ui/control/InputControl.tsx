import React from 'react';

import { Input } from '@flippo-ui/headless-components';

export function InputControl(props: InputControl.Props) {
    return <Input {...props} />;
}

export namespace InputControl {
    export type Props = Input.Props;
}
