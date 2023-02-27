/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const server = '';
const port = 7255;
const dbName = '';
const username = '';
const password = '';
const url = `jdbc:mysql://${server}:${port}/${dbName}`;

function readData() {
  const conn = Jdbc.getConnection(url, username, password);
  const stmt = conn.createStatement();
  const results = stmt.executeQuery('SELECT o.payment_id, u.email, GROUP_CONCAT(i.title SEPARATOR ', '), o.payment_method, o.payed_amount, o.fee_amount, o.status, o.created_at FROM orders AS o INNER JOIN users AS u ON o.user_id = u.id INNER JOIN items AS i ON i.order_id = o.id GROUP BY payment_id');
  const metaData = results.getMetaData();
  const numCols = metaData.getColumnCount();
  const spreadsheet = SpreadsheetApp.getActive();
  const sheet = spreadsheet.getSheetByName('Pedidos');
  sheet.clearContents();
  let arr = ['  Id do pagamento  ', '  Cliente  ', '  Items  ', '  Método de pagamento  ', '  Total do pedido  ', '  Taxa  ', '  Status  ', '  Data  '];

  //  for (var col = 0; col < numCols; col++) {
  //    arr.push(metaData.getColumnName(col + 1));
  //  }

  sheet.appendRow(arr);

  while (results.next()) {
    arr = [];
    for (let col = 0; col < numCols; col += 1) {
      arr.push(results.getString(col + 1));
    }
    sheet.appendRow(arr);
  }

  results.close();
  stmt.close();
  sheet.autoResizeColumns(1, numCols + 1);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Atualizar pedidos')
    .addItem('Atualizar', 'readData')
    .addToUi();
}
