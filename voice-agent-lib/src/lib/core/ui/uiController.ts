import { highlightRows } from './uiOverlay';

let hostStore: any | null = null;
export function setHostStore(store: any | null) {
  hostStore = store;
}

type UIPlan = { type: 'ui'; action: 'filter' | 'click' | 'type' | 'upload'; target?: string; value?: any; successMessage?: string };

export async function performUIAction(plan: UIPlan): Promise<string> {
  switch (plan.action) {
    case 'filter': {
      const target = String(plan.target || '');
      const value = String(plan.value || '');
      if (hostStore) {
        const criteria = buildCriteriaFromTargetValue(target, value);
        if (criteria) {
          hostStore.dispatch({ type: 'filters/setCriteria', payload: criteria });
          return plan.successMessage || 'Applied filter';
        }
      }
      // Fallback: DOM filtering if no store provided
      applyFilterDOM(target, value);
      highlightRows();
      return plan.successMessage || 'Applied filter';
    }
    case 'upload': {
      window.dispatchEvent(new CustomEvent('voiceAgent:triggerUpload'));
      return plan.successMessage || 'Triggered upload';
    }
    default:
      return 'No UI action performed';
  }
}

function applyFilterDOM(target: string, value: string) {
  const table = document.querySelector('[data-cases-table="true"]') as HTMLTableElement | null;
  if (!table) return;
  const headerCells = Array.from(table.querySelectorAll('thead th')).map((th) => th.textContent?.toLowerCase().trim() || '');
  const statusIdx = headerCells.findIndex((h) => h.includes('status'));
  const assignedIdx = headerCells.findIndex((h) => h.includes('assigned'));

  const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[];
  rows.forEach((tr) => {
    const cells = Array.from(tr.children) as HTMLTableCellElement[];
    let show = true;
    if (target === 'status' && statusIdx >= 0) {
      const cellText = (cells[statusIdx]?.textContent || '').toLowerCase();
      show = cellText.includes(value.toLowerCase());
    }
    if (target === 'assignedTo' && assignedIdx >= 0) {
      const cellText = (cells[assignedIdx]?.textContent || '').toLowerCase();
      if (value === 'me') {
        show = cellText.includes('analyst');
      } else {
        show = cellText.includes(value.toLowerCase());
      }
    }
    (tr as any).style.display = show ? '' : 'none';
  });
}

function buildCriteriaFromTargetValue(target: string, value: string) {
  const v = value.trim();
  if (!v) return [];
  // Allow clearing filters via 'all'
  if (v.toLowerCase() === 'all') return [];
  if (target === 'status') {
    return [{ field: 'CASESTATUS', operator: 'EQUAL_TO', value: v.toUpperCase() }];
  }
  if (target === 'assignedTo' || target === 'owner') {
    return [{ field: 'ASSIGNTONAME', operator: 'CONTAINS', value: v }];
  }
  if (target === 'bank' || target === 'company') {
    return [{ field: 'COMPLAINANTCOMPANYNAME', operator: 'CONTAINS', value: v }];
  }
  return null;
}


