
/**
 * Formátuje datum ve formátu ISO na lokalizovaný formát
 * @param isoDate ISO formát datumu
 * @returns Lokalizované datum ve formátu dd.mm.yyyy hh:mm
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString('cs-CZ', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
