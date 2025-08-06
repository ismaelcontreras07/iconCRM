<?php
// backend/api/accounts/listAccounts.php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');

try {
  $sql = "
    SELECT
      a.*,
      -- concatena todas las razones sociales en un solo string
      GROUP_CONCAT(rs.nombre ORDER BY rs.tipo DESC SEPARATOR ', ') 
        AS razones_sociales
    FROM accounts AS a
    LEFT JOIN razones_sociales AS rs
      ON rs.account_id = a.id
    GROUP BY a.id
    ORDER BY a.created_at DESC
  ";
  $stmt     = $pdo->query($sql);
  $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    'success'  => true,
    'accounts' => $accounts
  ]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Error al listar cuentas'
  ]);
}
