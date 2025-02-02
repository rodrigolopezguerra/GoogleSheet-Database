// Configurar el endpoint de la API
function doGet(e) {
  const action = e.parameter.action;
  const sheetName = e.parameter.sheet || "Hoja 1"; // Nombre de la hoja principal
  const token = e.parameter.token; // Token proporcionado en la solicitud

  if (!isValidToken(token)) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Invalid or missing token" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Sheet not found" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  switch (action) {
    case "read":
      return readData(sheet);
    case "readByKey":
      return readDataByKey(sheet, e.parameter.key, e.parameter.value);
    case "write":
      return writeOrUpdateData(sheet, e.parameter);
    case "delete":
      return deleteDataByKey(sheet, e.parameter.key, e.parameter.value);
    default:
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Invalid action" })
      ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Validar token contra Hoja 2
function isValidToken(token) {
  const tokenSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hoja 2");
  if (!tokenSheet) {
    return false;
  }

  const tokens = tokenSheet.getDataRange().getValues().flat();
  return tokens.includes(token);
}

// Leer todos los datos de la hoja
function readData(sheet) {
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  const data = rows.map((row) => {
    const record = {};
    headers.forEach((header, i) => {
      record[header] = row[i];
    });
    return record;
  });

  return ContentService.createTextOutput(
    JSON.stringify({ status: "success", data })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Leer datos por llave específica
function readDataByKey(sheet, key, value) {
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const keyIndex = headers.indexOf(key);

  if (keyIndex === -1) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Key not found in headers" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const row = rows.find((row, index) => index > 0 && row[keyIndex] == value);
  if (!row) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "No matching record found" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const record = {};
  headers.forEach((header, i) => {
    record[header] = row[i];
  });

  return ContentService.createTextOutput(
    JSON.stringify({ status: "success", data: record })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Escribir o actualizar datos en la hoja
function writeOrUpdateData(sheet, params) {
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const key = headers[0]; // Se asume que la primera columna es la clave
  const keyValue = params[key];

  if (!keyValue) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: `Key "${key}" is missing in parameters` })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Validar unicidad
  const uniqueColumn = "email"; // Cambiar dinámicamente según sea necesario
  if (!isUniqueValue(sheet, uniqueColumn, params[uniqueColumn])) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: `Value for "${uniqueColumn}" must be unique` })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const keyIndex = headers.indexOf(key);
  if (keyIndex === -1) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Key column not found in headers" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const existingRowIndex = rows.findIndex((row, index) => index > 0 && row[keyIndex] == keyValue);

  if (existingRowIndex > 0) {
    // Actualizar fila existente
    const newRow = headers.map((header) => params[header] || "");
    sheet.getRange(existingRowIndex + 1, 1, 1, newRow.length).setValues([newRow]);
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Row updated" })
    ).setMimeType(ContentService.MimeType.JSON);
  } else {
    // Agregar nueva fila
    ensureCapacity(sheet);
    const newRow = headers.map((header) => params[header] || "");
    sheet.appendRow(newRow);
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Row added" })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Verificar unicidad en una columna
function isUniqueValue(sheet, columnName, value) {
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const colIndex = headers.indexOf(columnName);

  if (colIndex === -1) {
    throw new Error(`Column "${columnName}" not found`);
  }

  return !rows.some((row, index) => index > 0 && row[colIndex] == value);
}

// Eliminar una línea por llave específica
function deleteDataByKey(sheet, key, value) {
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const keyIndex = headers.indexOf(key);

  if (keyIndex === -1) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Key not found in headers" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const rowIndex = rows.findIndex((row, index) => index > 0 && row[keyIndex] == value);

  if (rowIndex > 0) {
    sheet.deleteRow(rowIndex + 1);
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Row deleted" })
    ).setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "No matching record found" })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Asegurar que haya suficiente espacio en la hoja
function ensureCapacity(sheet) {
  const lastRow = sheet.getLastRow();
  const maxRows = sheet.getMaxRows();
  if (lastRow === maxRows) {
    sheet.insertRowsAfter(maxRows, 1000);
  }
}
