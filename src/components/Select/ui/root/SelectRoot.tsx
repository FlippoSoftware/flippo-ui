import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';

export function SelectRoot<Value, Multiple extends boolean | undefined = false>(props: SelectRoot.Props<Value, Multiple>) {
    return <SelectHeadless.Root {...props} />;
}

export namespace SelectRoot {
    export type Props<Value, Multiple extends boolean | undefined = false> = SelectHeadless.Root.Props<Value, Multiple>;
}
