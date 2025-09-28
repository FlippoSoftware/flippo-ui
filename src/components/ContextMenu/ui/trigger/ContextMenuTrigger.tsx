import React from 'react';

import { ContextMenu as ContextMenuHeadless } from '@flippo-ui/headless-components/context-menu';

export function ContextMenuTrigger(props: ContextMenuTrigger.Props) {
    return <ContextMenuHeadless.Trigger {...props} />;
}

export namespace ContextMenuTrigger {
    export type Props = ContextMenuHeadless.Trigger.Props;
}
