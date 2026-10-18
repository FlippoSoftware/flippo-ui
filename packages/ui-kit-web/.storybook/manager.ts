// The Storybook UI in the Flippo UI theme: palette, logo and title (`tools/storybook/theme.ts`).
import { addons } from '@storybook/manager-api';

import { flippoTheme } from '@flippo-software/workspace-tools/storybook/theme';

addons.setConfig({ theme: flippoTheme('Web Components') });
