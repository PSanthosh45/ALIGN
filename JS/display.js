document.addEventListener('DOMContentLoaded', function () {
    // Load CSV data
    fetch('Data\\coursedata.csv')
        .then(response => response.text())
        .then(data => {
            const csvRows = data.split('\n');
            const table = document.getElementById('csvTable');

            // Add data rows
            for (let i = 0; i < csvRows.length; i++) {
                const rowData = csvRows[i].split(',');
                const row = table.insertRow();
                rowData.forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData;
                    row.appendChild(td);
                });
            }
        });

    // Handle changes in the table and update CSV
    document.getElementById('csvTable').addEventListener('input', function (e) {
        const rowIndex = e.target.parentElement.rowIndex;
        const colIndex = e.target.cellIndex;

        fetch('Data\\coursedata.csv')
            .then(response => response.text())
            .then(data => {
                const csvRows = data.split('\n');
                const newData = csvRows.map((row, index) => {
                    if (index === rowIndex) {
                        const cells = row.split(',');
                        cells[colIndex] = e.target.textContent;
                        return cells.join(',');
                    }
                    return row;
                });

                const updatedCSV = newData.join('\n');

                // Update the CSV file with the changes
                fetch('Data\\coursedata.csv', {
                    method: 'PUT', // Use the appropriate method (PUT, POST, etc.) for your server setup
                    body: updatedCSV,
                });
            });
    });
});
