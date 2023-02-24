USE goodboy;
SELECT 
  o.payment_id, 
  MAX(u.email) AS email, 
  GROUP_CONCAT(CONCAT(i.title, ' (', i.quantity,' x' ' R$', FORMAT(i.unit_price, 2, 'pt_BR'), ')') SEPARATOR ', '), 
  o.payment_method AS payment_method, 
  SUM(o.total_amount) AS total_amount, 
  SUM(o.fee_amount) AS fee_amount, 
  SUM(o.net_received_amount) AS net_received_amount, 
  MAX(o.status) AS status, 
  SUBSTR(DATE_FORMAT(CONVERT_TZ(MAX(o.created_at), '+00:00', '-03:00'), '%d/%m/%Y %H:%i'), -16) AS created_at
FROM orders AS o 
INNER JOIN users AS u ON o.user_id = u.id 
INNER JOIN items AS i ON i.order_id = o.id
GROUP BY o.payment_id;
