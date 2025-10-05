import type { MenuRoot } from '../root/MenuRoot';

export type MenuOpenEventDetails = {
    open: boolean;
    reason: MenuRoot.ChangeEventReason | null;
    nodeId: string | undefined;
    parentNodeId: string | null;
};
