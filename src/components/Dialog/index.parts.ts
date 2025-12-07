import { Dialog as DialogHeadless } from '@flippo-ui/headless-components/dialog';

export { DialogBackdrop as Backdrop } from './ui/backdrop/DialogBackdrop';
export { DialogClose as Close } from './ui/close/DialogClose';
export { DialogDescription as Description } from './ui/description/DialogDescription';
export { DialogPopup as Popup } from './ui/popup/DialogPopup';
export { DialogPortal as Portal } from './ui/portal/DialogPortal';
export { DialogRoot as Root } from './ui/root/DialogRoot';
export { DialogTitle as Title } from './ui/title/DialogTitle';
export { DialogTrigger as Trigger } from './ui/trigger/DialogTrigger';
export { DialogViewport as Viewport } from './ui/viewport/DialogViewport';

export const createHandle = DialogHeadless.createHandle;
