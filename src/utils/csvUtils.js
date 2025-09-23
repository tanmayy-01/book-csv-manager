import * as Papa from 'papaparse';

export const downloadCSV = (data, filename) => {
  const csv = Papa.unparse(data.map(row => ({
    Title: row.Title,
    Author: row.Author,
    Genre: row.Genre,
    PublishedYear: row.PublishedYear,
    ISBN: row.ISBN
  })));
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};