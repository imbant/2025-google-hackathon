const obfuscatedApiKey = [
    "QUl6YVN5QUVFQUQ=",
    "NkU1LTMybkNwRmVGMlI=",
    "aVBIY1hlZjduMnAxQ0k=",
];

function deobfuscate(parts: string[]): string {
    return parts.map(part => atob(part)).join('');
}

export function getApiKey(): string {
    return deobfuscate(obfuscatedApiKey);
}
