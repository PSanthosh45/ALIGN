<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $csvFile = 'Data\coursedata.csv';
    $rows = array_map('str_getcsv', file($csvFile));

    $rows[$data['rowIndex']][$data['colIndex']] = $data['value'];

    file_put_contents($csvFile, implode("\n", array_map('implode', $rows)));

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
