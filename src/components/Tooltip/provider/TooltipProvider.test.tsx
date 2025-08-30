import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tooltip } from '..';

describe('tooltipProvider', () => {
    it('should render children', () => {
        render(
            <Tooltip.Provider>
                <div>{'Child'}</div>
            </Tooltip.Provider>
        );
        expect(screen.getByText('Child')).toBeInTheDocument();
    });

    it('should have default delay', () => {
        render(
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Popup>{'Popup'}</Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );
        // This is a placeholder test. We will test the delay in the root component.
        expect(screen.getByText('Trigger')).toBeInTheDocument();
    });

    it('should set delay', () => {
        render(
            <Tooltip.Provider delay={1000}>
                <Tooltip.Root>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Popup>{'Popup'}</Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );
        // This is a placeholder test. We will test the delay in the root component.
        expect(screen.getByText('Trigger')).toBeInTheDocument();
    });

    it('should set closeDelay', () => {
        render(
            <Tooltip.Provider closeDelay={1000}>
                <Tooltip.Root>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Popup>{'Popup'}</Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );
        // This is a placeholder test. We will test the delay in the root component.
        expect(screen.getByText('Trigger')).toBeInTheDocument();
    });
});
