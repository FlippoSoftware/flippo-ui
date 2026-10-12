import React from 'react';

import { createRenderer, screen } from '@flippo/internal-test-utils';
import { describe, expect, it } from 'vitest';

import { RENDER_MODES } from '../../test/renderModes';

import { Separator } from './Separator';

describe.each(RENDER_MODES)('Separator ($name)', ({ reactStrictMode }) => {
    const { render } = createRenderer({ reactStrictMode });

    it('renders a horizontal separator by default', () => {
        render(<Separator />);
        const separator = screen.getByRole('separator');
        expect(separator.tagName).toBe('DIV');
        expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
        expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('follows the orientation prop', () => {
        const { rerender } = render(<Separator orientation='vertical' />);
        expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
        rerender(<Separator orientation='horizontal' />);
        expect(screen.getByRole('separator')).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('passes state to className and forwards props and the ref', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Separator ref={ref} orientation='vertical' className={(state) => state.orientation} data-testid='sep' />);
        const separator = screen.getByTestId('sep');
        expect(separator).toHaveClass('vertical');
        expect(ref.current).toBe(separator);
    });
});
