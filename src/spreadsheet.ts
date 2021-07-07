import { GoogleSpreadsheet } from "google-spreadsheet";

const credentials = JSON.parse(
  process.env.CREDENTIALS ? process.env.CREDENTIALS : ""
);

export interface Data {
  StockCode: string;
  Close: number;
}

class Spreadsheet {
  async updateStockPrice(rows: Data[]) {
    const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

    await doc.useServiceAccountAuth(credentials);

    await doc.loadInfo();

    const sheet = doc.sheetsByTitle["Price"];

    if (sheet) {
      await sheet.updateProperties({ title: "Price Backup" });
    }

    const newSheet = await doc.addSheet({
      headerValues: ["StockCode", "Close"],
    });
    await newSheet.updateProperties({ title: "Price" });
    await newSheet.addRows(rows);

    await sheet.delete();
  }
}

export default Spreadsheet;
