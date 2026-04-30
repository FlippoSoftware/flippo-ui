export function clearStyles(element: HTMLElement | null, originalStyles: React.CSSProperties) {
    if (element) {
        Object.assign(element.style, originalStyles);
    }
}

export const LIST_FUNCTIONAL_STYLES = {
    position: 'relative',
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'auto'
} as const;

export function getMaxPopupHeight(popupStyles: CSSStyleDeclaration) {
    const maxHeightStyle = popupStyles.maxHeight || '';
    return maxHeightStyle.endsWith('px') ? Number.parseFloat(maxHeightStyle) || Infinity : Infinity;
}

export function getMaxScrollTop(scroller: HTMLElement) {
    return Math.max(0, scroller.scrollHeight - scroller.clientHeight);
}

const TRANSFORM_STYLE_RESETS = [['transform', 'none'], ['scale', '1'], ['translate', '0 0']] as const;

export type TransformStyleProperty = (typeof TRANSFORM_STYLE_RESETS)[number][0];

export function unsetTransformStyles(popupElement: HTMLElement) {
    const { style } = popupElement;
    const originalStyles = {} as Record<TransformStyleProperty, string>;

    for (const [property, value] of TRANSFORM_STYLE_RESETS) {
        originalStyles[property] = style.getPropertyValue(property);
        style.setProperty(property, value, 'important');
    }

    return () => {
        for (const [property] of TRANSFORM_STYLE_RESETS) {
            const originalValue = originalStyles[property];
            if (originalValue) {
                style.setProperty(property, originalValue);
            }
            else {
                style.removeProperty(property);
            }
        }
    };
}
