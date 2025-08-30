import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tooltip } from '..';

describe('tooltipTrigger', () => {
    it('should render children', () => {
        render(
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        <div>{'Child'}</div>
                    </Tooltip.Trigger>
                </Tooltip.Root>
            </Tooltip.Provider>
        );
        expect(screen.getByText('Child')).toBeInTheDocument();
    });

    it('should have aria-describedby', async () => {
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

        const trigger = screen.getByText('Trigger');
        const popup = screen.getByText('Popup');
        expect(trigger).toHaveAttribute('aria-describedby', popup.id);
    });
});
