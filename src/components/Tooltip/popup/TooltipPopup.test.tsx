import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tooltip } from '..';

describe('tooltipPopup', () => {
    it('should render children', () => {
        render(
            <Tooltip.Provider>
                <Tooltip.Root open>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Popup>
                                <div>{'Child'}</div>
                            </Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );
        expect(screen.getByText('Child')).toBeInTheDocument();
    });

    it('should have role="tooltip"', () => {
        render(
            <Tooltip.Provider>
                <Tooltip.Root open>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Popup>{'Popup'}</Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );
        expect(screen.getByText('Popup')).toHaveAttribute('role', 'tooltip');
    });
});
