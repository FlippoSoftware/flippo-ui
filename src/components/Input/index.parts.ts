import { Input as InputHeadless } from '@flippo-ui/headless-components/input';

export { InputBody as Body } from './ui/body/InputBody';
export { InputClear as Clear } from './ui/clear/InputClear';
export { InputRoot as Root } from './ui/root/InputRoot';
export { InputSlot as Slot } from './ui/slot/InputSlot';

export const useInputControl: typeof InputHeadless.useInputControl = InputHeadless.useInputControl;
