import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tooltip } from '..';

describe('tooltipArrow', () => {
    it('should render without errors', () => {
        render(
            <Tooltip.Provider>
                <Tooltip.Root open>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Popup>
                                <Tooltip.Arrow data-testid={'tooltip-arrow'} />
                            </Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );
        // We can't test the size directly, because it's passed through context
        // and applied via useRenderElement. We just check that it renders.
        expect(screen.getByTestId('tooltip-arrow')).toBeInTheDocument();
    });
});
