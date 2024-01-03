document.addEventListener('DOMContentLoaded', function () {
    // Fetch the CSV file
    fetch('output_student.csv')
        .then(response => response.text())
        .then(csvData => {
            // Split the CSV data into rows
            var rows = csvData.trim().split('\n');

            // Create the HTML table
            var tableHtml = '<table>';

            // Determine the maximum number of items in a row
            var maxItems = 0;
            rows.forEach(function (row) {
                var rowData = row.split(',');
                maxItems = Math.max(maxItems, rowData.length);
            });

            // Loop through each item in the rows
            for (var i = 0; i < maxItems; i++) {
                tableHtml += '<tr>';

                // Loop through each CSV row
                rows.forEach(function (row) {
                    // Split the CSV row into individual items
                    var rowData = row.split(',');

                    // Add the item to the current column
                    if (i < rowData.length) {
                        // Check if the cell is empty
                        var cellValue = rowData[i].trim();
                        var cellClass = cellValue !== '' ? 'non-empty' : 'empty';
                        if (i == 0){
                            tableHtml += '<td class="' + cellClass + ' header_cell">' + cellValue + '</td>';
                        } else {
                            tableHtml += '<td class="' + cellClass + '">' + cellValue + '</td>';
                        }
                    } else {
                        tableHtml += '<td></td>';
                    }
                });

                tableHtml += '</tr>';
            }

            // Close the table tag
            tableHtml += '</table>';

            // Display the table in the table container
            document.getElementById('table-container').innerHTML = tableHtml;
        })
        .catch(error => console.error('Error fetching CSV file:', error));
});

