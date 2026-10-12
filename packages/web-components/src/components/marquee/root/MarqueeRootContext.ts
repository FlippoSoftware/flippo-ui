import { createContext } from '../../../lib/context';

import type { MarqueeElement } from './MarqueeElement';

export const MarqueeContext = createContext<MarqueeElement>('marquee');

export const MARQUEE_ROOT = [MarqueeContext] as const;
