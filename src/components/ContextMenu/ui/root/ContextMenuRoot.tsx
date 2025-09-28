import React from 'react';

import { ContextMenu as ContextMenuHeadless } from '@flippo-ui/headless-components/context-menu';

export function ContextMenuRoot(props: ContextMenuRoot.Props) {
    return <ContextMenuHeadless.Root {...props} />;
}

export namespace ContextMenuRoot {
    export type Props = ContextMenuHeadless.Root.Props;
}
