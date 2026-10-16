# @flippo-software/internal-test-utils

Test helpers for the React packages of the [`flippo-ui`](../../README.md) workspace, used by the tests of
[`@flippo-software/react-components`](../react-components). Modelled on `@mui/internal-test-utils`.

> **Private package**: not published, consumed only inside the workspace (`workspace:*` dev dependency).

## Usage

```tsx
import { act, createRenderer, fireEvent, screen, waitFor } from '@flippo-software/internal-test-utils';
import { expect, it } from 'vitest';

const { render } = createRenderer();

it('opens on trigger press', async () => {
    const { user } = render(<Popover.Root>…</Popover.Root>);

    await user.click(screen.getByRole('button'));

    expect(screen.getByRole('dialog')).toBeVisible();
});
```

`createRenderer(options)` registers an `afterEach` cleanup (`autoCleanup`, on by default) and returns `render`.
`render(ui, options)` renders through Testing Library inside a `DirectionProvider` (`direction: 'ltr' | 'rtl'`), an
optional `wrapper` and, with `enablePerformanceMonitoring`, a `PerformanceMonitor`. The result is Testing Library's
plus `user` (a `userEvent` instance that advances Vitest fake timers when they are on) and `getByTestIdEnhanced`
(lists the available test ids when one is missing).

## Exports

| Area | Exports |
| --- | --- |
| Renderers | `createRenderer`, `defaultRenderer`, `rtlRenderer`, `performanceRenderer` |
| Setup | `init`, `quickSetup`, `setupVitest`, `setupCompoundComponentTesting`, `setupPerformanceTesting`, `setupDebugMode`, `createTestEnvironment` |
| Matchers | `initMatchers`, `headlessMatchers`, `waitForPosition`, `waitForStateChange` (plus `@testing-library/jest-dom`) |
| Helpers | `HeadlessTestUtils`, `createHeadlessTestUtils`, `testCompoundComponent`, `testInteractionScenarios`, `testAsChildPattern` |
| Runners | `AccessibilityTestRunner` (`KEYBOARD_PATTERNS`), `PerformanceTestRunner`, `EventTestRunner`, `CompoundComponentTester` |
| Providers | `DirectionProvider`, `PerformanceMonitor`, `PerformanceContext`, `usePerformanceMetrics`, `TestIdProvider`, `useTestId` |
| Re-exports | Testing Library (`screen`, `fireEvent`, `waitFor`, `waitForElementToBeRemoved`, `act`, `cleanup`), `userEvent`, Vitest (`vi`, `expect`, `describe`, `it`…) |

The react-components tests use mostly `createRenderer`, `screen`, `waitFor`, `act` and `fireEvent`; the runners and
helpers are available for broader suites.

## Development

Built with tsup (ESM + CJS, types with TypeScript 5): `pnpm --filter @flippo-software/internal-test-utils build`, or
`pnpm build` / `pnpm dev` at the workspace root. react-components imports its `dist/`, so rebuild after a change.
The package has no tests of its own; it is exercised by the react-components suite.
