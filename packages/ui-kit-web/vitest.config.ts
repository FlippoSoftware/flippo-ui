import { clientConditions, serverConditions } from '@flippo-software/workspace-tools';
import { defineConfig } from 'vitest/config';

import { alias } from './aliases';

export default defineConfig({
    // component-styles from its sources (`tools/workspace.ts`).
    resolve: { alias, conditions: clientConditions },
    ssr: { resolve: { conditions: serverConditions } },
    test: { environment: 'happy-dom', include: ['src/**/__tests__/*.test.ts', 'src/**/__tests__/*.test.tsx'] }
});
