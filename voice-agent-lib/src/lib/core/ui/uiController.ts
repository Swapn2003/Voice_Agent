import { highlightRows } from './uiOverlay';

type UIPlan = { type: 'ui'; action: 'filter' | 'click' | 'type' | 'upload'; target?: string; value?: any; successMessage?: string };

export async function performUIAction(plan: UIPlan): Promise<string> {
  switch (plan.action) {
    case 'filter': {
      applyFilterDOM(String(plan.target || ''), String(plan.value || ''));
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


