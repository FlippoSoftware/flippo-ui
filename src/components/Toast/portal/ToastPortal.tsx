import { FloatingPortalLite } from '~@lib/FloatingPortalLite';

export const ToastPortal = FloatingPortalLite;

export type ToastPortalProps = {} & FloatingPortalLite.Props<ToastPortal.State>;

// eslint-disable-next-line ts/no-redeclare
export namespace ToastPortal {
    export type State = {};

    export type Props = ToastPortalProps;
}
