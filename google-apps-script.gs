/**
 * Thryve Growth — Contact Form → Google Sheets bridge.
 *
 * Setup:
 * 1. Open the "Thryve Growth - Website Enquiries" Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Delete any starter code and paste this file's contents in.
 * 4. Deploy > New deployment > type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Authorize when prompted, then copy the Web app URL (ends in /exec).
 * 6. Paste that URL into SHEET_ENDPOINT in script.js on the website.
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.brand || '',
    data.service || '',
    data.message || '',
  ]);

  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
