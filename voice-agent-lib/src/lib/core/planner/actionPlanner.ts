import type { ParsedIntent } from '../nlp/intentParser';
import type { Entities } from '../nlp/entityExtractor';

export type UIStep = { kind: 'ui'; action: 'filter' | 'click' | 'type' | 'upload'; target?: string; value?: any; successMessage?: string };
export type APIStep = { kind: 'api'; method: 'GET' | 'POST' | 'PUT' | 'DELETE'; url: string; headers?: Record<string, string>; body?: any; successMessage?: string };
export type NoopStep = { kind: 'noop'; reason?: string };
export type Step = UIStep | APIStep | NoopStep;
export type Plan = Step[];

export function planAction({ intent, entities, context }: { intent: ParsedIntent; entities: Entities; context: any }): Plan {
  const cfg = context || {};
  switch (intent.name) {
    case 'LIST_CASES_PENDING':
      return [{ kind: 'ui', action: 'filter', target: 'status', value: 'pending', successMessage: 'Showing pending cases' }];
    case 'LIST_CASES_MINE':
      return [{ kind: 'ui', action: 'filter', target: 'assignedTo', value: 'me', successMessage: 'Showing your cases' }];
    case 'FILTER_STATUS':
      return [{ kind: 'ui', action: 'filter', target: 'status', value: entities.status, successMessage: `Filtered status to ${entities.status}` }];
    case 'UPLOAD_FILE':
      return [{ kind: 'ui', action: 'upload', target: 'upload', value: { type: entities.fileType || 'file' }, successMessage: 'Ready to upload file' }];
    case 'EMAIL_BANK_FOR_CASE': {
      const url = `${cfg.caseApiBase || '/api'}/cases/${entities.caseId}/email-bank`;
      return [{ kind: 'api', method: 'POST', url, successMessage: `Emailed bank for case ${entities.caseId}` }];
    }
    default:
      return [{ kind: 'noop', reason: 'Can\'t perform an action for this intent' }];
  }
}


