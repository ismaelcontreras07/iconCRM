<?php
// backend/api/accounts/updateAccounts.php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Método no permitido']);
  exit;
}

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
if (!$id) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'ID faltante']);
  exit;
}

// Sanitizar y validar campos
$name     = trim($_POST['name'] ?? '');
if (!$name) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'El nombre es obligatorio']);
  exit;
}

$industry    = trim($_POST['industry']    ?? null);
$website     = trim($_POST['website']     ?? null);
$phone       = trim($_POST['phone']       ?? null);
$email       = trim($_POST['email']       ?? null);
$address     = trim($_POST['address']     ?? null);
$city        = trim($_POST['city']        ?? null);
$state       = trim($_POST['state']       ?? null);
$country     = trim($_POST['country']     ?? null);
$postal_code = trim($_POST['postal_code'] ?? null);
$status      = in_array($_POST['status'] ?? '', ['activo','inactivo'])
               ? $_POST['status'] : 'activo';
$owner_id    = isset($_POST['owner_id']) ? (int)$_POST['owner_id'] : null;

try {
  $stmt = $pdo->prepare("
    UPDATE accounts SET
      name=?, industry=?, website=?, phone=?,
      email=?, address=?, city=?, state=?,
      country=?, postal_code=?, owner_id=?, status=?
    WHERE id=?
  ");
  $stmt->execute([
    $name, $industry, $website, $phone,
    $email, $address, $city, $state,
    $country, $postal_code, $owner_id, $status,
    $id
  ]);
  echo json_encode(['success' => true, 'updated' => $stmt->rowCount()]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Error al actualizar cuenta']);
}
