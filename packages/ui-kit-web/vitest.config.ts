import { defineConfig } from 'vitest/config';

import { clientConditions, serverConditions } from '../../tools/workspace';

export default defineConfig({
    // component-styles from its sources (`tools/workspace.ts`).
    resolve: { conditions: clientConditions },
    ssr: { resolve: { conditions: serverConditions } },
    test: { environment: 'happy-dom', include: ['test/**/*.test.ts', 'test/**/*.test.tsx'] }
});
