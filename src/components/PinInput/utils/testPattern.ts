// Pre-compiled regex patterns for better performance
const PATTERNS = {
    alphabetic: /^[a-z]$/i,
    numeric: /^\d$/,
    alphanumeric: /^[a-z0-9]$/i
} as const;

// Cache for custom patterns to avoid re-compilation
const patternCache = new Map<string, RegExp>();

export function testPattern(
    value: string,
    type?: 'alphanumeric' | 'numeric' | 'alphabetic',
    pattern?: string
): boolean {
    // Empty value should not pass validation
    if (value === '') {
        return false;
    }

    if (pattern) {
        let regex = patternCache.get(pattern);
        if (!regex) {
            regex = new RegExp(pattern);
            patternCache.set(pattern, regex);
        }
        return regex.test(value);
    }

    if (type && PATTERNS[type]) {
        return PATTERNS[type].test(value);
    }

    return true;
}
