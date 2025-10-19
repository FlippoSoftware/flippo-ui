import React from 'react';

import { cx } from 'class-variance-authority';

import styles from './QrCodeBorder.module.scss';

export function QrCodeBorder(props: QrCodeBorder.Props) {
    const {
        cornerLength,
        strokeWidth = 2,
        className
    } = props;

    const borderRef = React.useRef<HTMLDivElement>(null);

    const updateRadius = React.useCallback(() => {
        const border = borderRef.current;
        if (!border)
            return;

        const parent = border.parentElement;
        if (!parent)
            return;

        const parentStyle = getComputedStyle(parent);

        const borderRadiusTopLeftPx = parentStyle.borderTopLeftRadius;
        const borderRadiusTopRightPx = parentStyle.borderTopRightRadius;
        const borderRadiusBottomLeftPx = parentStyle.borderBottomLeftRadius;
        const borderRadiusBottomRightPx = parentStyle.borderBottomRightRadius;

        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        const preparedCornerLength = cornerLength ?? Math.min(parentWidth, parentHeight) * 0.2;

        border.style.setProperty('--radius-top-left', borderRadiusTopLeftPx);
        border.style.setProperty('--radius-top-right', borderRadiusTopRightPx);
        border.style.setProperty('--radius-bottom-left', borderRadiusBottomLeftPx);
        border.style.setProperty('--radius-bottom-right', borderRadiusBottomRightPx);

        border.style.setProperty('--stroke-width', `${strokeWidth}px`);
        border.style.setProperty('--corner-length', `${preparedCornerLength}px`);
    }, [strokeWidth, cornerLength]);

    React.useLayoutEffect(() => {
        updateRadius();

        const border = borderRef.current;
        if (!border?.parentElement)
            return;

        // ResizeObserver для отслеживания изменений размера родителя
        const resizeObserver = new ResizeObserver(updateRadius);
        resizeObserver.observe(border.parentElement);

        // MutationObserver для отслеживания изменений стилей родителя
        const mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes'
                  && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    updateRadius();
                }
            }
        });

        mutationObserver.observe(border.parentElement, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [updateRadius]);

    return (
        <div className={cx(styles.QrCodeBorder, className)} ref={borderRef} role={'presentation'}>
            <div className={styles.TopLeftCorner} />
            <div className={styles.TopRightCorner} />
            <div className={styles.BottomLeftCorner} />
            <div className={styles.BottomRightCorner} />
        </div>
    );
}

export namespace QrCodeBorder {
    export type Props = {
        /**
         * Length of the corner lines in viewBox units
         * @default 20
         */
        cornerLength?: number;
        /**
         * Width of the stroke
         * @default 2
         */
        strokeWidth?: number;

    } & React.ComponentProps<'svg'>;
}
