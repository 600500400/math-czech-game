
/**
 * Formátuje datum ve formátu ISO na lokalizovaný formát
 * @param isoDate ISO formát datumu
 * @returns Lokalizované datum ve zkráceném formátu d.m.yy h'h'
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString('cs-CZ', { 
    day: 'numeric',
    month: 'numeric',
    year: '2-digit',
    hour: 'numeric'
  }).replace(/\s/, ' ') + 'h';
}
