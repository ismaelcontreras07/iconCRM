<?php
// backend/api/sales/monthlySummary.php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');

try {
  // 1) Clientes por mes (por issue_date)
  $sqlC = "
    SELECT DATE_FORMAT(issue_date,'%Y-%m') AS month,
           SUM(total) AS total_clients
    FROM customer_invoices
    GROUP BY month
    ORDER BY month
  ";
  $clients = $pdo->query($sqlC)->fetchAll(PDO::FETCH_KEY_PAIR);

  // 2) Proveedores por mes (por issue_date)
  $sqlP = "
    SELECT DATE_FORMAT(issue_date,'%Y-%m') AS month,
           SUM(total) AS total_providers
    FROM provider_invoices
    GROUP BY month
    ORDER BY month
  ";
  $providers = $pdo->query($sqlP)->fetchAll(PDO::FETCH_KEY_PAIR);

  // 3) Comisiones por mes: unimos commissions con customer_invoices para usar issue_date
  $sqlComm = "
    SELECT DATE_FORMAT(ci.issue_date,'%Y-%m') AS month,
           SUM(c.amount)             AS total_commissions
    FROM commissions c
    JOIN customer_invoices ci
      ON c.invoice_id = ci.id
    GROUP BY month
    ORDER BY month
  ";
  $commissions = $pdo->query($sqlComm)->fetchAll(PDO::FETCH_KEY_PAIR);

  // 4) Unificamos todos los meses
  $months = array_unique(
    array_merge(
      array_keys($clients),
      array_keys($providers),
      array_keys($commissions)
    )
  );
  sort($months);

  // 5) Construimos el array final
  $data = [];
  foreach ($months as $m) {
    $data[] = [
      'month'       => $m,
      'clients'     => round($clients[$m]     ?? 0, 2),
      'providers'   => round($providers[$m]   ?? 0, 2),
      'commissions' => round($commissions[$m] ?? 0, 2),
    ];
  }

  echo json_encode(['success'=>true, 'data'=>$data]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}
  