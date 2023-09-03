import { GoogleSpreadsheet } from "google-spreadsheet";
import { Stock } from "./idx";
import { JWT } from "google-auth-library";

const credentials = JSON.parse(
  process.env.CREDENTIALS ? process.env.CREDENTIALS : ""
);

const serviceAccountAuth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

interface Data {
  [key: string]: string | number | boolean;
}

type HeaderValues = (keyof Stock)[];

const HEADER_VALUES: HeaderValues = [
  "StockCode",
  "Close",
  "ForeignBuy",
  "ForeignSell",
];
class Spreadsheet {
  async updateStockPrice(rows: Data[]) {
    const SHEET_ID = process.env.SHEET_ID;

    if (!SHEET_ID) {
      throw new Error("SHEET_ID is not defined");
    }
    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);

    await doc.loadInfo();

    let sheet = doc.sheetsByTitle["Price"];

    if (sheet === undefined) {
      sheet = await doc.addSheet({
        title: "Price",
        headerValues: HEADER_VALUES,
      });
    }

    await sheet.clear();
    await sheet.setHeaderRow(HEADER_VALUES);
    await sheet.addRows(rows);
  }
}

export default Spreadsheet;
