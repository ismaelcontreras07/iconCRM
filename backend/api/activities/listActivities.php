<?php
// backend/api/activities/list.php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');

try {
  $sql = "
    SELECT
      a.*,
      u.name AS assigned_name
    FROM activities AS a
    JOIN users AS u
      ON u.id = a.assigned_to
    ORDER BY a.due_date ASC, a.due_time ASC, a.created_at DESC
  ";
  $stmt       = $pdo->query($sql);
  $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    'success' => true,
    'data'    => $activities
  ]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Error al listar actividades'
  ]);
}
