import { createContext } from '../../../lib/context';

import type { MenubarElement } from './MenubarElement';

export const MenubarContext = createContext<MenubarElement>('menubar');
