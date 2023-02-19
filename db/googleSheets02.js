/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function getDataFromMySQL() {
  const server = 'containers-us-west-182.railway.app';
  const port = 7255;
  const dbName = 'railway';
  const user = 'root';
  const password = 'dzCumOIaDITLzLnWfVK9';
  const url = `jdbc:mysql://${server}:${port}/${dbName}`;

  const conn = Jdbc.getConnection(url, user, password);
  const stmt = conn.createStatement();

  // get the start date and end date from cells in the Google Sheets spreadsheet
  const sheet = SpreadsheetApp.getActiveSheet();
  const startCell = sheet.getRange('J2');
  const endCell = sheet.getRange('K2');
  const startDate = startCell.isBlank() ? null : new Date(startCell.getValue());
  const endDate = endCell.isBlank() ? null : new Date(endCell.getValue());

  // // format the dates as MySQL-compatible strings in Brazilian format
  // const timeZone = Session.getScriptTimeZone();
  // const datePattern = 'yyyy/MM/dd';
  // const startDateStr = startDate ? Utilities.formatDate(startDate, timeZone, datePattern) : null;
  // const endDateStr = endDate ? Utilities.formatDate(endDate, timeZone, datePattern) : null;

  // format the dates as English timestamp strings
  const startTimestamp = startDate ? Math.floor(startDate.getTime() / 1000) : null;
  const endTimestamp = endDate ? Math.floor(endDate.getTime() / 1000) : null;

  // construct the SQL query with the start and end dates, if specified
  let sqlQuery = "SELECT o.payment_id, u.email, GROUP_CONCAT(i.title SEPARATOR ', ') AS 'Items', o.payment_method, o.payed_amount, o.fee_amount, o.status, DATE_FORMAT(o.created_at, '%d/%m/%Y') FROM orders AS o INNER JOIN users AS u ON o.user_id = u.id INNER JOIN items AS i ON i.order_id = o.id";
  if (startTimestamp && endTimestamp) {
    sqlQuery += ` WHERE o.created_at BETWEEN FROM_UNIXTIME(${startTimestamp}) AND FROM_UNIXTIME(${endTimestamp})`;
  }

  sqlQuery += ' GROUP BY o.payment_id';

  const results = stmt.executeQuery(sqlQuery);

  sheet.getRange(2, 1, sheet.getLastRow(), 8).clearContent();

  let row = 2;

  while (results.next()) {
    const rowData = [];
    for (let i = 1; i <= results.getMetaData().getColumnCount(); i += 1) {
      rowData.push(results.getString(i));
    }
    if (rowData.length > 0) {
      sheet.getRange(row, 1, 1, rowData.length).setValues([rowData]);
      row += 1;
    }
  }

  const metaData = results.getMetaData();
  const numCols = metaData.getColumnCount();

  results.close();
  stmt.close();
  conn.close();
  sheet.autoResizeColumns(1, numCols + 1);

  Logger.log(`${row - 2} rows imported.`);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Atualizar pedidos')
    .addItem('Atualizar', 'getDataFromMySQL')
    .addToUi();
}
