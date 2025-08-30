import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tooltip } from '..';

describe('tooltipPortal', () => {
    it('should render children in a portal', () => {
        render(
            <Tooltip.Provider>
                <Tooltip.Root open>
                    <Tooltip.Trigger>{'Trigger'}</Tooltip.Trigger>
                    <Tooltip.Portal>
                        <div>{'Portal Child'}</div>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        );
        expect(screen.getByText('Portal Child')).toBeInTheDocument();
    });
});
