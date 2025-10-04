import React from 'react';

import { Select as SelectHeadless } from '@flippo-ui/headless-components/select';

export function SelectPortal(props: SelectPortal.Props) {
    return <SelectHeadless.Portal {...props} />;
}

export namespace SelectPortal {
    export type Props = SelectHeadless.Portal.Props;
}
