export function toTitleCase(str: string | undefined | null): string {
    str = str?.toLowerCase() ?? '';
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

export function replaceUnderscoresWithSpaces(inputString: string) {
    return inputString.replace(/_/g, ' ');
  }


export const api = "http://127.0.0.1:5000"
// export const api = "https://csstudent09.ucd.ie"