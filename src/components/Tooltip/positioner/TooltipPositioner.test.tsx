import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tooltip } from '..';

describe('tooltipPositioner', () => {
    it('should render children', () => {
        render(
            <Tooltip.Provider>
                <Tooltip.Root open>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner>
                            <div>{'Positioner Child'}</div>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );
        expect(screen.getByText('Positioner Child')).toBeInTheDocument();
    });
});
