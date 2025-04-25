
export const exportToCSV = (data: any[], filename: string) => {
  // Convert data to CSV format
  const csvContent = data.map(row => {
    return Object.values(row)
      .map(value => {
        if (typeof value === 'number') {
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(value);
        }
        return `"${value}"`; // Wrap strings in quotes to handle commas
      })
      .join(',');
  }).join('\n');

  const headers = Object.keys(data[0]).join(',');
  const csv = `${headers}\n${csvContent}`;
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
