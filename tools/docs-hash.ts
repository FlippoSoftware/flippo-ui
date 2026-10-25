import { createHash } from 'node:crypto';

/** A translation's source identity, independent of line endings and surrounding whitespace. */
export function docsHash(text: string): string {
    return createHash('sha256').update(text.replace(/\r\n/g, '\n').trim()).digest('hex').slice(0, 12);
}
