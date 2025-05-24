const obfuscatedApiKey = [
    "QUl6YVN5Q3FCWDc=",
    "T2ZPd0VCUGFJeWw=",
    "RzZrRjlSbWRfNWt1UUdVOVE=",
];

function deobfuscate(parts: string[]): string {
    return parts.map(part => atob(part)).join('');
}

export function getApiKey(): string {
    return deobfuscate(obfuscatedApiKey);
}
