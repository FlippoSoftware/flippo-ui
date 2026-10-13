'use client';
import { tooltip as recipe } from '@flippo-software/component-styles/tooltip';
import { Tooltip as Primitive } from '@flippo-software/react-components/tooltip';

import { createStyler } from '~@lib/Styled';

import type { RecipeVariants, StyledComponent } from '~@lib/Styled';

const styled = createStyler(recipe, 'tooltip');
export type Variants = RecipeVariants<typeof recipe>;
export const Arrow: StyledComponent<typeof Primitive.Arrow, typeof recipe> = styled(Primitive.Arrow, 'arrow', false);
export const Multiple: typeof Primitive.Multiple = Primitive.Multiple;
export const Popup: StyledComponent<typeof Primitive.Popup, typeof recipe> = styled(Primitive.Popup, 'popup', false);
export const Portal: typeof Primitive.Portal = Primitive.Portal;
export const Positioner: StyledComponent<typeof Primitive.Positioner, typeof recipe> = styled(Primitive.Positioner, 'positioner', false, {
    defaults: { sideOffset: 10 }
});
export const Provider: typeof Primitive.Provider = Primitive.Provider;
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Trigger: typeof Primitive.Trigger = Primitive.Trigger;
