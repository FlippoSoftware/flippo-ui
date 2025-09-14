export function testPattern(value: string, type?: 'alphanumeric' | 'numeric' | 'alphabetic', pattern?: string) {
    if (pattern) {
        return new RegExp(pattern).test(value);
    }

    if (type === 'alphabetic') {
        return /^[a-z]/i.test(value);
    }

    if (type === 'numeric') {
        return /\d/.test(value);
    }

    if (type === 'alphanumeric') {
        return /^[a-z0-9]/i.test(value);
    }

    return true;
}
