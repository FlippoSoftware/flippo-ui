'use client';
import { textarea as recipe } from '@flippo-software/component-styles/textarea';
import { Textarea as Primitive } from '@flippo-software/react-components/textarea';

import { InputBody } from '../../lib/Input';
import { createStyler } from '../../lib/Styled';

import type { StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'textarea');
export const Root: StyledComponent<typeof Primitive, typeof recipe> = styled(Primitive, undefined, true);
export const Body: StyledComponent<typeof InputBody, typeof recipe> = styled(InputBody, 'root', false, {
    focusControlOnPress: true,
    part: 'body'
});
export const Control: StyledComponent<typeof Primitive.Slot, typeof recipe> = styled(Primitive.Slot, 'control');
export const Slot: StyledComponent<typeof Primitive.Slot, typeof recipe> = styled(Primitive.Slot, 'control', false, { part: 'slot' });
export const Icon: StyledComponent<'span', typeof recipe> = styled('span', 'icon');
export const useTextareaControl: typeof Primitive.useTextareaControl = Primitive.useTextareaControl;
