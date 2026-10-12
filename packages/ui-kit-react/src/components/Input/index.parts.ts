'use client';
import { input as recipe } from '@flippo-software/component-styles/input';
import { Input as Primitive } from '@flippo-ui/headless-components/input';

import { icon } from '../../lib/Icon';
import { InputBody, InputClear } from '../../lib/Input';
import { createStyler } from '../../lib/Styled';

import type { StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'input');
export const Root: StyledComponent<typeof Primitive, typeof recipe> = styled(Primitive, undefined, true);
export const Body: StyledComponent<typeof InputBody, typeof recipe> = styled(InputBody, 'root', false, {
    focusControlOnPress: true,
    part: 'body'
});
export const Control: StyledComponent<typeof Primitive.Slot, typeof recipe> = styled(Primitive.Slot, 'control');
export const Slot: StyledComponent<typeof Primitive.Slot, typeof recipe> = styled(Primitive.Slot, 'control', false, { part: 'slot' });
export const Icon: StyledComponent<'span', typeof recipe> = styled('span', 'icon', false, { defaults: { children: icon('magnifier') } });
export const useInputControl: typeof Primitive.useInputControl = Primitive.useInputControl;
export const Clear: StyledComponent<typeof InputClear, typeof recipe> = styled(InputClear, 'clear', false, {
    defaults: { children: icon('xmark') }
});
