export type Entities = { caseId?: string; status?: string; assignedTo?: string; fileType?: string };

export function extractEntities(text: string): Entities {
  const entities: Entities = {};
  const caseMatch = text.match(/case\s*(\d+)/i);
  if (caseMatch) entities.caseId = caseMatch[1];
  const statusMatch = text.match(/status\s*(pending|open|closed|approved|rejected)/i);
  if (statusMatch) entities.status = statusMatch[1].toLowerCase();
  if (/excel/i.test(text)) entities.fileType = 'excel';
  const mine = /(my|assigned to me)/i.test(text);
  if (mine) entities.assignedTo = 'me';
  return entities;
}


