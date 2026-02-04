import { Participant, GroupResult } from './types';

export const parseNames = (input: string): Participant[] => {
  // Split by new lines or commas
  const names = input.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
  
  // Return all names including duplicates so the UI can detect them
  return names.map(name => ({
    id: crypto.randomUUID(),
    name
  }));
};

export const exportToCSV = (filename: string, headers: string[], rows: string[][]) => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Add BOM for Excel compatibility with UTF-8
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}