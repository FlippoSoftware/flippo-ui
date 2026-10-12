'use client';
import { toast as recipe } from '@flippo-software/component-styles/toast';
import { Toast as Primitive } from '@flippo-ui/headless-components/toast';

import { icon } from '../../lib/Icon';
import { createStyler } from '../../lib/Styled';

import type { RecipeVariants, StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'toast');
export type Variants = RecipeVariants<typeof recipe>;
export const Action: StyledComponent<typeof Primitive.Action, typeof recipe> = styled(Primitive.Action, 'action', false);
export const Close: StyledComponent<typeof Primitive.Close, typeof recipe> = styled(Primitive.Close, 'close', false, {
    defaults: { children: icon('xmark') }
});
export const createToastManager: typeof Primitive.createToastManager = Primitive.createToastManager;
export const Description: StyledComponent<typeof Primitive.Description, typeof recipe> = styled(
    Primitive.Description,
    'description',
    false
);
export const Portal: typeof Primitive.Portal = Primitive.Portal;
export const Provider: typeof Primitive.Provider = Primitive.Provider;
export const Root: StyledComponent<typeof Primitive.Root, typeof recipe> = styled(Primitive.Root, 'root', true);
export const Title: StyledComponent<typeof Primitive.Title, typeof recipe> = styled(Primitive.Title, 'title', false);
export const useToastManager: typeof Primitive.useToastManager = Primitive.useToastManager;
export const Viewport: StyledComponent<typeof Primitive.Viewport, typeof recipe> = styled(Primitive.Viewport, 'viewport', false);
export const Icon: StyledComponent<'span', typeof recipe> = styled('span', 'icon');
export const Timer: StyledComponent<'span', typeof recipe> = styled('span', 'timer');
export const Content: StyledComponent<'div', typeof recipe> = styled('div', 'content');
