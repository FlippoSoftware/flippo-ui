import type * as React from 'react';

/**
 * Layout of the gallery stories (see `.storybook/preview.css`): a page of sections, each with a title, a description
 * and a zone holding the examples; rows label the states or sizes on the left, as on the Figma component sheets.
 */
export function Page({ children }: { children: React.ReactNode }): React.JSX.Element {
    return <div className='sb-page'>{children}</div>;
}

/** Turns the `code` spans of a description into `<code>`, as Storybook does with the docs descriptions. */
function inlineCode(text: string): React.ReactNode[] {
    return text.split('`').map((part, index) => (index % 2 ? <code key={part}>{part}</code> : part));
}

export function Section({
    title,
    description,
    raised = false,
    children
}: {
    title: string;
    description?: string;
    /** The zone is a card surface (`bg-1`), for components meant to sit on cards (inverted inputs). */
    raised?: boolean;
    children: React.ReactNode;
}): React.JSX.Element {
    return (
        <section className='sb-section'>
            <div className='sb-section-head'>
                <h3 className='sb-section-title'>{title}</h3>
                {description && <p className='sb-section-text'>{inlineCode(description)}</p>}
            </div>
            <div className={raised ? 'sb-zone sb-zone--raised' : 'sb-zone'}>{children}</div>
        </section>
    );
}

export function Row({
    label,
    column = false,
    fill = false,
    children
}: {
    label: string;
    column?: boolean;
    /** The items are fields: each takes a comfortable width. */
    fill?: boolean;
    children: React.ReactNode;
}): React.JSX.Element {
    const className = ['sb-items', column && 'sb-items--column', fill && 'sb-items--fill'].filter(Boolean).join(' ');
    return (
        <div className='sb-row'>
            <span className='sb-row-label'>{label}</span>
            <div className={className}>{children}</div>
        </div>
    );
}

export function Grid({ min, children }: { min?: number; children: React.ReactNode }): React.JSX.Element {
    return (
        <div className='sb-grid' style={min ? ({ '--sb-min': `${min}px` } as React.CSSProperties) : undefined}>
            {children}
        </div>
    );
}

export function Card({ caption, children }: { caption?: string; children: React.ReactNode }): React.JSX.Element {
    return (
        <div className='sb-card'>
            {caption && <span className='sb-caption'>{caption}</span>}
            {children}
        </div>
    );
}

/** A container the reader resizes by its corner, to see how a layout adapts to the width. */
export function Resizable({ children }: { children: React.ReactNode }): React.JSX.Element {
    return <div className='sb-resizable'>{children}</div>;
}
