import { GoogleSpreadsheet } from "google-spreadsheet";
import { Stock } from "./idx";

const credentials = JSON.parse(
  process.env.CREDENTIALS ? process.env.CREDENTIALS : ""
);

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
    const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

    await doc.useServiceAccountAuth(credentials);

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
