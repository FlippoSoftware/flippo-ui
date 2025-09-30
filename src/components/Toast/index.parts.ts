import { Toast as ToastHeadless } from '@flippo-ui/headless-components/toast';

export { ToastAction as Action } from './ui/action/ToastAction';
export { ToastClose as Close } from './ui/close/ToastClose';
export { ToastDescription as Description } from './ui/description/ToastDescription';
export { ToastPortal as Portal } from './ui/portal/ToastPortal';
export { ToastProvider as Provider } from './ui/provider/ToastProvider';
export { ToastRoot as Root } from './ui/root/ToastRoot';
export { ToastTitle as Title } from './ui/title/ToastTitle';
export { ToastViewport as Viewport } from './ui/viewport/ToastViewport';

export const createToastManager = ToastHeadless.createToastManager;
export const useToastManager = ToastHeadless.useToastManager;

export type ToastManagerEvent = ToastHeadless.ToastManagerEvent;
export type ToastObject<Data extends object> = ToastHeadless.ToastObject<Data>;
