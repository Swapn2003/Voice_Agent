export type ParsedIntent = { name: string; confidence: number };

const RULES: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /(show|list).*(pending).*cases/i, name: 'LIST_CASES_PENDING' },
  { pattern: /(show|list).*(my).*cases/i, name: 'LIST_CASES_MINE' },
  { pattern: /(upload).*(excel|file)/i, name: 'UPLOAD_FILE' },
  { pattern: /(email|mail).*(bank).*(case)\s*(\d+)/i, name: 'EMAIL_BANK_FOR_CASE' },
  { pattern: /(filter).*(status)\s*(\w+)/i, name: 'FILTER_STATUS' }
];

export function parseIntent(text: string): ParsedIntent {
  for (const r of RULES) {
    if (r.pattern.test(text)) return { name: r.name, confidence: 0.8 };
  }
  return { name: 'UNKNOWN', confidence: 0.2 };
}


