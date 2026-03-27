/**
 * Shared Google Sheets sync helper.
 * Appends a row to the specified sheet tab within the Citychurch Forms spreadsheet.
 *
 * Environment variables (set in Vercel):
 *   GOOGLE_SHEETS_PRIVATE_KEY — service account private key
 *   GOOGLE_SHEETS_CLIENT_EMAIL — service account email
 *   GOOGLE_SHEETS_SPREADSHEET_ID — the target spreadsheet ID
 */

export async function syncToGoogleSheets(
  sheetName: string,
  values: string[]
): Promise<void> {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!privateKey || !clientEmail || !spreadsheetId) {
    console.log(`[Google Sheets] Not configured — skipping sync to "${sheetName}". Values:`, values);
    return;
  }

  const { google } = await import('googleapis');

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  });
}
