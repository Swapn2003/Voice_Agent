export function highlightRows() {
  const table = document.querySelector('[data-cases-table="true"]');
  if (!table) return;
  table.classList.add('overlay-highlight');
  setTimeout(() => table.classList.remove('overlay-highlight'), 1000);
}


