'use client';
import { menubar as recipe } from '@flippo-software/component-styles/menubar';
import { Menu } from '@flippo-ui/headless-components/menu';
import { Menubar as Primitive } from '@flippo-ui/headless-components/menubar';

import { createStyler } from '../../lib/Styled';

import type { StyledComponent } from '../../lib/Styled';

const styled = createStyler(recipe, 'menubar');
const Root: StyledComponent<typeof Primitive, typeof recipe> = styled(Primitive, 'root', true);
const Trigger: StyledComponent<typeof Menu.Trigger, typeof recipe> = styled(Menu.Trigger, 'trigger');
export const Menubar: typeof Root & { Root: typeof Root; Trigger: typeof Trigger } = Object.assign(Root, { Root, Trigger });
