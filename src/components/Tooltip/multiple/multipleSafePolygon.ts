import { Timeout } from '@flippo-ui/hooks/use-timeout';

import type { HandleClose } from '~@packages/floating-ui-react/hooks/useHover';

import type { TooltipMultipleStore } from './TooltipMultipleStore';

type Point = [number, number];
type Polygon = Point[];

/**
 * Checks if a point is inside a polygon using ray casting algorithm.
 */
function isPointInPolygon(point: Point, polygon: Polygon): boolean {
    if (polygon.length < 3) {
        return false;
    }

    const [x, y] = point;
    let isInside = false;
    const length = polygon.length;

    for (let i = 0, j = length - 1; i < length; j = i++) {
        const [xi, yi] = polygon[i] || [0, 0];
        const [xj, yj] = polygon[j] || [0, 0];
        const intersect = (yi >= y) !== (yj >= y) && x <= ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) {
            isInside = !isInside;
        }
    }

    return isInside;
}

/**
 * Gets the center point of a rectangle.
 */
function getRectCenter(rect: DOMRect): Point {
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
}

/**
 * Creates a convex hull from a set of points using Graham scan.
 */
function convexHull(points: Point[]): Point[] {
    if (points.length < 3) {
        return points;
    }

    // Find the point with lowest y (and leftmost if tie)
    let start = 0;
    for (let i = 1; i < points.length; i++) {
        const current = points[i]!;
        const startP = points[start]!;
        if (current[1] < startP[1] || (current[1] === startP[1] && current[0] < startP[0])) {
            start = i;
        }
    }

    const startPoint = points[start]!;

    // Sort by polar angle with respect to start point
    const sorted = points
        .filter((_, i) => i !== start)
        .sort((a, b) => {
            const angleA = Math.atan2(a[1] - startPoint[1], a[0] - startPoint[0]);
            const angleB = Math.atan2(b[1] - startPoint[1], b[0] - startPoint[0]);
            if (angleA !== angleB) {
                return angleA - angleB;
            }
            // If same angle, closer point first
            const distA = (a[0] - startPoint[0]) ** 2 + (a[1] - startPoint[1]) ** 2;
            const distB = (b[0] - startPoint[0]) ** 2 + (b[1] - startPoint[1]) ** 2;
            return distA - distB;
        });

    // Build hull
    const hull: Point[] = [startPoint];

    for (const point of sorted) {
        while (hull.length > 1) {
            const prev = hull[hull.length - 2]!;
            const last = hull[hull.length - 1]!;
            if (cross(prev, last, point) <= 0) {
                hull.pop();
            }
            else {
                break;
            }
        }
        hull.push(point);
    }

    return hull;
}

/**
 * Cross product of vectors OA and OB where O is origin.
 */
function cross(o: Point, a: Point, b: Point): number {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

/**
 * Expands a polygon by a buffer amount.
 */
function expandPolygon(polygon: Point[], buffer: number): Point[] {
    if (polygon.length < 3) {
        return polygon;
    }

    const centroid: Point = [polygon.reduce((sum, p) => sum + p[0], 0) / polygon.length, polygon.reduce((sum, p) => sum + p[1], 0) / polygon.length];

    return polygon.map((point) => {
        const dx = point[0] - centroid[0];
        const dy = point[1] - centroid[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) {
            return point;
        }
        const scale = (dist + buffer) / dist;
        return [centroid[0] + dx * scale, centroid[1] + dy * scale] as Point;
    });
}

/**
 * Creates a safe polygon between a trigger and its popup.
 */
function createTriggerPopupPolygon(
    triggerRect: DOMRect,
    popupRect: DOMRect,
    buffer: number
): Polygon {
    // Determine the side where popup is relative to trigger
    const triggerCenter = getRectCenter(triggerRect);
    const popupCenter = getRectCenter(popupRect);

    const dx = popupCenter[0] - triggerCenter[0];
    const dy = popupCenter[1] - triggerCenter[1];

    // Create a polygon that covers the area between trigger and popup
    const points: Point[] = [];

    if (Math.abs(dx) > Math.abs(dy)) {
        // Popup is to the left or right
        if (dx > 0) {
            // Popup is to the right
            points.push([triggerRect.right - buffer, triggerRect.top - buffer]);
            points.push([triggerRect.right - buffer, triggerRect.bottom + buffer]);
            points.push([popupRect.left + buffer, popupRect.bottom + buffer]);
            points.push([popupRect.left + buffer, popupRect.top - buffer]);
        }
        else {
            // Popup is to the left
            points.push([triggerRect.left + buffer, triggerRect.top - buffer]);
            points.push([triggerRect.left + buffer, triggerRect.bottom + buffer]);
            points.push([popupRect.right - buffer, popupRect.bottom + buffer]);
            points.push([popupRect.right - buffer, popupRect.top - buffer]);
        }
    }
    else {
        // Popup is above or below
        if (dy > 0) {
            // Popup is below
            points.push([triggerRect.left - buffer, triggerRect.bottom - buffer]);
            points.push([triggerRect.right + buffer, triggerRect.bottom - buffer]);
            points.push([popupRect.right + buffer, popupRect.top + buffer]);
            points.push([popupRect.left - buffer, popupRect.top + buffer]);
        }
        else {
            // Popup is above
            points.push([triggerRect.left - buffer, triggerRect.top + buffer]);
            points.push([triggerRect.right + buffer, triggerRect.top + buffer]);
            points.push([popupRect.right + buffer, popupRect.bottom - buffer]);
            points.push([popupRect.left - buffer, popupRect.bottom - buffer]);
        }
    }

    return points;
}

/**
 * Gets corner points of a rectangle with buffer.
 */
function getRectCorners(rect: DOMRect, buffer: number): Point[] {
    return [[rect.left - buffer, rect.top - buffer], [rect.right + buffer, rect.top - buffer], [rect.right + buffer, rect.bottom + buffer], [rect.left - buffer, rect.bottom + buffer]];
}

export type MultipleSafePolygonOptions = {
    /**
     * Buffer around elements.
     * @default 5
     */
    buffer?: number;
    /**
     * Whether to block pointer events on body.
     * @default false
     */
    blockPointerEvents?: boolean;
    /**
     * Enable debug mode to visualize polygons.
     * @default false
     */
    debug?: boolean;
};

// Debug visualization
let debugSvg: SVGSVGElement | null = null;

function drawDebugPolygons(polygons: Polygon[], colors: string[]): void {
    if (!debugSvg) {
        debugSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        debugSvg.style.cssText = `
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 999999;
        `;
        document.body.appendChild(debugSvg);
    }

    debugSvg.innerHTML = '';

    polygons.forEach((polygon, i) => {
        if (polygon.length < 3) {
            return;
        }
        const color = colors[i % colors.length] ?? 'rgba(255, 0, 0, 0.2)';
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        path.setAttribute('points', polygon.map((p) => p.join(',')).join(' '));
        path.setAttribute('fill', color);
        path.setAttribute('stroke', color.replace('0.2', '1'));
        path.setAttribute('stroke-width', '2');
        debugSvg!.appendChild(path);
    });
}

function clearDebugPolygons(): void {
    if (debugSvg) {
        debugSvg.remove();
        debugSvg = null;
    }
}

/**
 * Creates a safe polygon handler for multiple tooltips.
 *
 * This builds:
 * 1. A convex hull connecting all triggers
 * 2. Individual trigger-popup connection polygons
 * 3. Rectangles around each popup
 *
 * The cursor is safe if it's inside any of these polygons.
 */
export function multipleSafePolygon(
    multipleStore: TooltipMultipleStore,
    options: MultipleSafePolygonOptions = {}
): HandleClose {
    const { buffer = 5, blockPointerEvents = false, debug = false } = options;

    const timeout = new Timeout();

    const fn: HandleClose = ({ onClose }) => {
        return function onMouseMove(event: MouseEvent) {
            function close() {
                timeout.clear();
                if (debug) {
                    clearDebugPolygons();
                }
                onClose();
            }

            timeout.clear();

            const { clientX, clientY } = event;
            const cursorPoint: Point = [clientX, clientY];

            // Get all triggers and popups
            const triggers = multipleStore.getAllTriggerElements();
            const popups = multipleStore.getAllPopupElements();

            if (triggers.length === 0) {
                return close();
            }

            const allPolygons: Polygon[] = [];
            const debugColors = [
                'rgba(255, 0, 0, 0.2)',
                'rgba(0, 255, 0, 0.2)',
                'rgba(0, 0, 255, 0.2)',
                'rgba(255, 255, 0, 0.2)',
                'rgba(255, 0, 255, 0.2)',
                'rgba(0, 255, 255, 0.2)'
            ];

            // 1. Create convex hull of all trigger centers + corners
            const allTriggerPoints: Point[] = [];
            for (const trigger of triggers) {
                const rect = trigger.getBoundingClientRect();
                allTriggerPoints.push(...getRectCorners(rect, buffer));
            }

            if (allTriggerPoints.length >= 3) {
                const triggersHull = convexHull(allTriggerPoints);
                const expandedHull = expandPolygon(triggersHull, buffer);
                allPolygons.push(expandedHull);
            }

            // 2. Create trigger-popup connection polygons
            for (const trigger of triggers) {
                const triggerRect = trigger.getBoundingClientRect();

                // Find the popup for this trigger (by checking which store it belongs to)
                for (const store of multipleStore.context.stores) {
                    if (store.context.triggerElements.hasElement(trigger)) {
                        const popupElement = store.select('popupElement');
                        if (popupElement) {
                            const popupRect = popupElement.getBoundingClientRect();
                            const connectionPoly = createTriggerPopupPolygon(triggerRect, popupRect, buffer);
                            allPolygons.push(connectionPoly);
                        }
                        break;
                    }
                }
            }

            // 3. Add popup rectangles
            for (const popup of popups) {
                const rect = popup.getBoundingClientRect();
                const popupPoly = getRectCorners(rect, buffer);
                allPolygons.push(popupPoly);
            }

            // Debug visualization
            if (debug) {
                drawDebugPolygons(allPolygons, debugColors);
            }

            // Check if cursor is in any polygon
            for (const polygon of allPolygons) {
                if (isPointInPolygon(cursorPoint, polygon)) {
                    return undefined; // Safe - don't close
                }
            }

            // Cursor is outside all safe zones - close with small delay
            timeout.start(50, close);

            return undefined;
        };
    };

    fn.__options = {
        blockPointerEvents
    };

    return fn;
}
