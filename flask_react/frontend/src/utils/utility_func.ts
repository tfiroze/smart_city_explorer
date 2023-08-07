export function toTitleCase(str: string | undefined | null): string {
    str = str?.toLowerCase() ?? '';
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
}