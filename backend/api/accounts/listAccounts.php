<?php
// backend/api/accounts/listAccounts.php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');

try {
  $stmt = $pdo->query("SELECT * FROM accounts ORDER BY created_at DESC");
  $accounts = $stmt->fetchAll();
  echo json_encode(['success' => true, 'accounts' => $accounts]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Error al listar cuentas']);
}
